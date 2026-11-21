import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

/** Non-owner role the apps connect as. NOSUPERUSER + NOBYPASSRLS, never owns a table (OQ-004). */
export const APP_ROLE = "pip_app";

const MIGRATIONS_FOLDER = fileURLToPath(new URL("../migrations", import.meta.url));

export interface MigrateOptions {
  /** Owner role: runs DDL and owns every table. */
  ownerUrl: string;
  /** App role URL (`DATABASE_URL`); its password is set on `pip_app`. */
  appUrl: string;
}

/**
 * Creates or updates the app role, then applies pending migrations as the owner. Idempotent.
 * Migrations are forward-only; rolling back means restoring from backup (OQ-036).
 */
export async function runMigrations({ ownerUrl, appUrl }: MigrateOptions): Promise<void> {
  const app = new URL(appUrl);
  const role = decodeURIComponent(app.username);
  const password = decodeURIComponent(app.password);
  if (role !== APP_ROLE) throw new Error(`DATABASE_URL must connect as ${APP_ROLE}, not "${role}"`);
  if (!password) throw new Error("DATABASE_URL has no password for the app role");
  if (decodeURIComponent(new URL(ownerUrl).username) === APP_ROLE) {
    throw new Error(`DATABASE_MIGRATION_URL must use the owner role, not ${APP_ROLE}`);
  }

  const sql = postgres(ownerUrl, { max: 1, onnotice: () => {} });
  try {
    await ensureAppRole(sql, password);
    await migrate(drizzle(sql), { migrationsFolder: MIGRATIONS_FOLDER });
  } finally {
    await sql.end({ timeout: 5 });
  }
}

async function ensureAppRole(sql: postgres.Sql, password: string): Promise<void> {
  const [row] = await sql<{ exists: boolean }[]>`
    select exists (select 1 from pg_roles where rolname = ${APP_ROLE}) as exists`;
  const verb = row?.exists ? "alter" : "create";
  // Role DDL takes no bind parameters; format() quotes the name and password server-side.
  const template = `${verb} role %I with login nosuperuser nobypassrls nocreatedb nocreaterole password %L`;
  const [stmt] = await sql<{ ddl: string }[]>`
    select format(${template}, ${APP_ROLE}::text, ${password}::text) as ddl`;
  if (!stmt) throw new Error("could not build app role statement");
  await sql.unsafe(stmt.ddl);
}
