// Tenant context and RLS (T-020, NFR-6, OQ-004) against real PostgreSQL (make test-integration).
// There is no tenant table before T-021, so a fixture table gets the standard tenant policy.
import { APP_ROLE, createDatabase, runMigrations } from "@pip/db";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TEST_APP_URL, TEST_OWNER_URL } from "../urls.js";

const ORG_A = "0b0e2c1a-6f43-4a39-9d55-1a2b3c4d5e01";
const ORG_B = "0b0e2c1a-6f43-4a39-9d55-1a2b3c4d5e02";
const USER = "7c9e6679-7425-40de-944b-e07fc1f90ae7";

const owner = postgres(TEST_OWNER_URL, { max: 1, onnotice: () => {} });
// One connection, so every query reuses the connection a previous withTenant ran on.
const app = createDatabase(postgres(TEST_APP_URL, { max: 1 }));

type Row = { organization_id: string; label: string };
const selectAll = sql`select organization_id, label from t020_fixture order by label`;
// Drizzle wraps driver errors; the PostgreSQL message is on `cause`.
const pgError = (pattern: RegExp) =>
  expect.objectContaining({ cause: expect.objectContaining({ message: expect.stringMatching(pattern) }) });

beforeAll(async () => {
  await owner`drop table if exists t020_fixture`;
  await owner`create table t020_fixture (
    id serial primary key, organization_id uuid not null, label text not null)`;
  await owner`alter table t020_fixture enable row level security`;
  await owner`create policy tenant_isolation on t020_fixture
    using (organization_id = app.current_org_id())
    with check (organization_id = app.current_org_id())`;
  await owner`insert into t020_fixture (organization_id, label)
    values (${ORG_A}, 'a1'), (${ORG_A}, 'a2'), (${ORG_B}, 'b1')`;
});

afterAll(async () => {
  await owner`drop table if exists t020_fixture`;
  await owner.end({ timeout: 5 });
  await app.sql.end({ timeout: 5 });
});

describe("app role", () => {
  it("is a login role without superuser or BYPASSRLS, and the apps connect as it", async () => {
    const [role] =
      await owner`select rolsuper, rolbypassrls, rolcanlogin from pg_roles where rolname = ${APP_ROLE}`;
    expect(role).toEqual({ rolsuper: false, rolbypassrls: false, rolcanlogin: true });
    const [who] = await app.db.execute<{ current_user: string }>(sql`select current_user`);
    expect(who?.current_user).toBe(APP_ROLE);
  });

  it("cannot switch RLS off", async () => {
    await expect(app.db.execute(sql`alter table t020_fixture disable row level security`)).rejects.toEqual(
      pgError(/must be owner/),
    );
    await expect(
      app.sql.begin(async (tx) => {
        await tx`set local row_security = off`;
        await tx`select * from t020_fixture`;
      }),
    ).rejects.toThrow(/row-level security/);
  });

  it("migrations are idempotent", async () => {
    await expect(runMigrations({ ownerUrl: TEST_OWNER_URL, appUrl: TEST_APP_URL })).resolves.toBeUndefined();
  });
});

describe("withTenant", () => {
  it("a query outside withTenant on a tenant table returns no rows", async () => {
    expect(await app.db.execute<Row>(selectAll)).toHaveLength(0);
  });

  it("sees only the rows of its organization", async () => {
    const a = await app.withTenant({ orgId: ORG_A, userId: USER }, (tx) => tx.execute<Row>(selectAll));
    expect(a.map((r) => r.label)).toEqual(["a1", "a2"]);
    const b = await app.withTenant({ orgId: ORG_B }, (tx) => tx.execute<Row>(selectAll));
    expect(b.map((r) => r.label)).toEqual(["b1"]);
  });

  it("sets app.org_id and app.user_id for the transaction", async () => {
    const [ctx] = await app.withTenant({ orgId: ORG_A, userId: USER }, (tx) =>
      tx.execute<{ org: string; usr: string }>(
        sql`select app.current_org_id() as org, app.current_user_id() as usr`,
      ),
    );
    expect(ctx).toEqual({ org: ORG_A, usr: USER });
  });

  it("rejects writes into another organization", async () => {
    await expect(
      app.withTenant({ orgId: ORG_A }, (tx) =>
        tx.execute(sql`insert into t020_fixture (organization_id, label) values (${ORG_B}, 'x')`),
      ),
    ).rejects.toEqual(pgError(/row-level security/));
  });

  it("does not leak the context to the next query on the same pooled connection", async () => {
    await app.withTenant({ orgId: ORG_A }, (tx) => tx.execute(selectAll));
    const [setting] = await app.db.execute<{ org: string | null }>(sql`select app.current_org_id() as org`);
    expect(setting?.org).toBeNull();
    expect(await app.db.execute<Row>(selectAll)).toHaveLength(0);
  });

  it("does not leak the context after a rolled-back transaction", async () => {
    await expect(
      app.withTenant({ orgId: ORG_A }, async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    expect(await app.db.execute<Row>(selectAll)).toHaveLength(0);
  });

  it("refuses a context that is not a UUID", async () => {
    await expect(app.withTenant({ orgId: "" }, async () => 1)).rejects.toThrow(/orgId must be a UUID/);
    await expect(app.withTenant({ orgId: "acme' or 1=1" }, async () => 1)).rejects.toThrow(/UUID/);
    await expect(app.withTenant({ orgId: ORG_A, userId: "nope" }, async () => 1)).rejects.toThrow(
      /userId must be a UUID/,
    );
  });
});
