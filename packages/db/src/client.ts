import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";
import { type TenantContext, type TenantTransaction, withTenant } from "./tenant.js";
import type { Database } from "./types.js";

/** Connection pool for the app role (`pip_app`, subject to RLS). Migrations use the owner role. */
export function createSql(url = process.env.DATABASE_URL): postgres.Sql {
  if (!url) throw new Error("DATABASE_URL is not set");
  return postgres(url, { max: Number(process.env.DATABASE_POOL_MAX ?? 10) });
}

export async function pingDatabase(sql: postgres.Sql): Promise<boolean> {
  try {
    await sql`select 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Drizzle over the app-role pool. Tenant tables are reachable only through `withTenant`; a query on
 * `db` outside it sees no tenant rows (OQ-004).
 */
export function createDatabase(sql: postgres.Sql = createSql()) {
  const db: Database = drizzle(sql, { schema });
  return {
    sql,
    db,
    withTenant: <T>(ctx: TenantContext, fn: (tx: TenantTransaction) => Promise<T>) => withTenant(db, ctx, fn),
  };
}
