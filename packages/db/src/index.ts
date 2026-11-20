import postgres from "postgres";

/** Connection pool for the app role. Tenant scoping (withTenant) arrives with T-020. */
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
