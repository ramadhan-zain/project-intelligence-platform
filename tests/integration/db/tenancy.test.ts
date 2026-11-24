// Tenancy schema (T-021, FR-10.1, FR-2.10, OQ-041) against real PostgreSQL (make test-integration).
// Rows are seeded as the owner (RLS does not apply to the table owner) and read back as the app role.
import { randomUUID } from "node:crypto";
import {
  createDatabase,
  organizations,
  projects,
  repositories,
  repositoryIntegrations,
  type TenantTransaction,
} from "@pip/db";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TEST_APP_URL, TEST_OWNER_URL } from "../urls.js";

const TENANT_TABLES = [
  "organizations",
  "organization_members",
  "projects",
  "project_members",
  "repositories",
  "repository_integrations",
] as const;

const owner = postgres(TEST_OWNER_URL, { max: 1, onnotice: () => {} });
const app = createDatabase(postgres(TEST_APP_URL, { max: 1 }));

// Drizzle wraps driver errors; the PostgreSQL message is on `cause`.
const pgError = (pattern: RegExp) =>
  expect.objectContaining({ cause: expect.objectContaining({ message: expect.stringMatching(pattern) }) });

/** Thrown to roll a withTenant transaction back on purpose. */
class RollBack extends Error {}

interface Tenant {
  org: string;
  user: string;
  project: string;
  repository: string;
  integration: string;
}

/** One organization with a member, a project, a project member, a repository and an integration. */
async function seedTenant(label: string, user: string): Promise<Tenant> {
  const t = {
    org: randomUUID(),
    user,
    project: randomUUID(),
    repository: randomUUID(),
    integration: randomUUID(),
  };
  const run = randomUUID().slice(0, 8);
  await owner`insert into organizations (id, name, slug) values (${t.org}, ${label}, ${`${label}-${run}`})`;
  await owner`insert into organization_members (organization_id, user_id, role, status)
    values (${t.org}, ${user}, 'owner', 'active')`;
  await owner`insert into projects (id, organization_id, name, project_manager_id)
    values (${t.project}, ${t.org}, ${`${label} project`}, ${user})`;
  await owner`insert into project_members (organization_id, project_id, user_id, role)
    values (${t.org}, ${t.project}, ${user}, 'manager')`;
  await owner`insert into repositories (id, organization_id, project_id, provider, external_id, url, default_branch)
    values (${t.repository}, ${t.org}, ${t.project}, 'github', ${`gh-${run}`}, ${`https://github.com/x/${run}`}, 'main')`;
  await owner`insert into repository_integrations (id, organization_id, project_id, repository_id, adapter_type, adapter_version)
    values (${t.integration}, ${t.org}, ${t.project}, ${t.repository}, 'markdown', '1.0.0')`;
  return t;
}

const alice = randomUUID(); // member of A and B
const bob = randomUUID(); // member of B only
let a: Tenant;
let b: Tenant;

beforeAll(async () => {
  for (const [id, name] of [
    [alice, "alice"],
    [bob, "bob"],
  ] as const) {
    await owner`insert into users (id, email, name) values (${id}, ${`${name}-${id}@example.test`}, ${name})`;
  }
  a = await seedTenant("org-a", alice);
  b = await seedTenant("org-b", bob);
  await owner`insert into organization_members (organization_id, user_id, role, status)
    values (${b.org}, ${alice}, 'member', 'active')`;
});

afterAll(async () => {
  const orgs = [a?.org, b?.org].filter(Boolean) as string[];
  for (const table of [...TENANT_TABLES].reverse()) {
    const column = table === "organizations" ? "id" : "organization_id";
    await owner`delete from ${owner(table)} where ${owner(column)} = any(${orgs})`;
  }
  await owner`delete from users where id = any(${[alice, bob]})`;
  await owner.end({ timeout: 5 });
  await app.sql.end({ timeout: 5 });
});

/** Organization ids visible in `table` for the given context. */
async function visibleOrgs(table: string, ctx: { orgId: string; userId?: string }): Promise<string[]> {
  const column = table === "organizations" ? "id" : "organization_id";
  const rows = await app.withTenant(ctx, (tx) =>
    tx.execute<{ org: string }>(
      sql`select distinct ${sql.identifier(column)} as org from ${sql.identifier(table)}`,
    ),
  );
  return rows.map((r) => r.org);
}

describe("RLS on tenant tables", () => {
  it.each(TENANT_TABLES)("%s has row level security and the tenant_isolation policy", async (table) => {
    const [row] = await owner`
      select c.relrowsecurity as rls,
        exists (select 1 from pg_policies p where p.tablename = c.relname and p.policyname = 'tenant_isolation') as policy
      from pg_class c where c.relname = ${table} and c.relnamespace = 'public'::regnamespace`;
    expect(row).toEqual({ rls: true, policy: true });
  });

  it.each(TENANT_TABLES)("%s: a cross-org select returns nothing", async (table) => {
    expect(await visibleOrgs(table, { orgId: a.org })).toEqual([a.org]);
    expect(await visibleOrgs(table, { orgId: b.org })).toEqual([b.org]);
  });

  it.each(TENANT_TABLES)("%s: no rows outside withTenant", async (table) => {
    const rows = await app.db.execute(sql`select 1 from ${sql.identifier(table)}`);
    expect(rows).toHaveLength(0);
  });

  it("cannot read another organization's row by id", async () => {
    const rows = await app.withTenant({ orgId: a.org }, (tx) =>
      tx.select().from(projects).where(sql`${projects.id} = ${b.project}`),
    );
    expect(rows).toHaveLength(0);
  });

  it("rejects writes into another organization", async () => {
    await expect(
      app.withTenant({ orgId: a.org }, (tx) =>
        tx.insert(projects).values({ organizationId: b.org, name: "intruder" }),
      ),
    ).rejects.toEqual(pgError(/row-level security/));
    await expect(
      app.withTenant({ orgId: a.org }, (tx) =>
        tx.insert(organizations).values({ id: b.org, name: "x", slug: `x-${randomUUID()}` }),
      ),
    ).rejects.toEqual(pgError(/row-level security|duplicate key/));
  });

  it("updates in another organization touch no rows", async () => {
    const updated = await app.withTenant({ orgId: a.org }, (tx) =>
      tx
        .update(projects)
        .set({ name: "renamed" })
        .where(sql`${projects.id} = ${b.project}`)
        .returning({ id: projects.id }),
    );
    expect(updated).toHaveLength(0);
  });
});

describe("own memberships across organizations (OQ-041)", () => {
  it("a user sees their memberships and organizations in every organization they belong to", async () => {
    const ctx = { orgId: a.org, userId: alice };
    expect((await visibleOrgs("organization_members", ctx)).sort()).toEqual([a.org, b.org].sort());
    expect((await visibleOrgs("organizations", ctx)).sort()).toEqual([a.org, b.org].sort());
  });

  it("other users' memberships elsewhere stay hidden", async () => {
    const rows = await app.withTenant({ orgId: a.org, userId: alice }, (tx) =>
      tx.execute<{ user_id: string }>(
        sql`select user_id from organization_members where organization_id = ${b.org}`,
      ),
    );
    expect(rows.map((r) => r.user_id)).toEqual([alice]);
  });

  it("the extra policy is read-only: no project or repository rows leak", async () => {
    const ctx = { orgId: a.org, userId: alice };
    for (const table of ["projects", "project_members", "repositories", "repository_integrations"]) {
      expect(await visibleOrgs(table, ctx)).toEqual([a.org]);
    }
    const updated = await app.withTenant(ctx, (tx) =>
      tx
        .update(organizations)
        .set({ name: "renamed" })
        .where(sql`${organizations.id} = ${b.org}`)
        .returning({ id: organizations.id }),
    );
    expect(updated).toHaveLength(0);
  });

  it("users has no RLS", async () => {
    const [row] = await owner`select relrowsecurity as rls from pg_class where relname = 'users'`;
    expect(row?.rls).toBe(false);
  });
});

describe("ownership (FR-10.1)", () => {
  const inA = <T>(fn: (tx: TenantTransaction) => Promise<T>) => app.withTenant({ orgId: a.org }, fn);

  it("a project needs an existing organization", async () => {
    await expect(owner`insert into projects (name) values ('orphan')`).rejects.toThrow(/organization_id/);
    await expect(
      owner`insert into projects (organization_id, name) values (${randomUUID()}, 'orphan')`,
    ).rejects.toThrow(/foreign key/);
  });

  it("a repository cannot point at a project of another organization", async () => {
    await expect(
      owner`insert into repositories (organization_id, project_id, provider, external_id, url, default_branch)
        values (${a.org}, ${b.project}, 'github', 'x', 'https://x', 'main')`,
    ).rejects.toThrow(/repositories_project_fk/);
  });

  it("an integration needs a project and belongs to its repository's project", async () => {
    await expect(
      owner`insert into repository_integrations (organization_id, repository_id, adapter_type, adapter_version)
        values (${a.org}, ${a.repository}, 'other', '1')`,
    ).rejects.toThrow(/project_id/);
    const otherProject = randomUUID();
    await owner`insert into projects (id, organization_id, name) values (${otherProject}, ${a.org}, 'other')`;
    await expect(
      owner`insert into repository_integrations (organization_id, project_id, repository_id, adapter_type, adapter_version)
        values (${a.org}, ${otherProject}, ${a.repository}, 'other', '1')`,
    ).rejects.toThrow(/repository_integrations_repository_fk/);
    await owner`delete from projects where id = ${otherProject}`;
  });

  it("a project manager must be a member of the project's organization", async () => {
    await expect(
      inA((tx) => tx.insert(projects).values({ organizationId: a.org, name: "p", projectManagerId: bob })),
    ).rejects.toEqual(pgError(/projects_project_manager_fk/));
  });

  it("the app role can create the full chain inside its organization", async () => {
    await inA(async (tx) => {
      const [project] = await tx
        .insert(projects)
        .values({ organizationId: a.org, name: "chain", projectManagerId: alice })
        .returning({ id: projects.id });
      if (!project) throw new Error("no project");
      const [repo] = await tx
        .insert(repositories)
        .values({
          organizationId: a.org,
          projectId: project.id,
          provider: "github",
          externalId: `chain-${randomUUID()}`,
          url: "https://github.com/x/chain",
          defaultBranch: "main",
        })
        .returning({ id: repositories.id });
      if (!repo) throw new Error("no repository");
      const [integration] = await tx
        .insert(repositoryIntegrations)
        .values({
          organizationId: a.org,
          projectId: project.id,
          repositoryId: repo.id,
          adapterType: "markdown",
          adapterVersion: "1.0.0",
        })
        .returning();
      expect(integration).toMatchObject({ syncMode: "hybrid", status: "pending", configuration: {} });
      // Leave nothing behind: roll the chain back.
      throw new RollBack();
    }).catch((e) => {
      if (!(e instanceof RollBack)) throw e;
    });
  });
});

describe("allowed values (OQ-007, OQ-042)", () => {
  it.each([
    ["organization_members.role", sql`update organization_members set role = 'root'`],
    ["organization_members.status", sql`update organization_members set status = 'gone'`],
    ["projects.status", sql`update projects set status = 'wip'`],
    ["projects.visibility", sql`update projects set visibility = 'public'`],
    ["project_members.role", sql`update project_members set role = 'owner'`],
    ["repositories.provider", sql`update repositories set provider = 'svn'`],
    ["repository_integrations.sync_mode", sql`update repository_integrations set sync_mode = 'webhook'`],
    ["repository_integrations.status", sql`update repository_integrations set status = 'ok'`],
  ])("%s rejects unknown values", async (_, statement) => {
    await expect(app.withTenant({ orgId: a.org }, (tx) => tx.execute(statement))).rejects.toEqual(
      pgError(/check constraint/),
    );
  });

  it("a target date before the start date is rejected", async () => {
    await expect(
      app.withTenant({ orgId: a.org }, (tx) =>
        tx.execute(sql`update projects set start_date = '2026-12-01', target_date = '2026-11-01'`),
      ),
    ).rejects.toEqual(pgError(/projects_dates_check/));
  });

  it("user email is unique regardless of case", async () => {
    await expect(
      owner`insert into users (email, name) values (${`ALICE-${alice}@EXAMPLE.TEST`}, 'dup')`,
    ).rejects.toThrow(/users_email_lower_key/);
  });
});
