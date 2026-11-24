import { defineConfig } from "drizzle-kit";

// Migrations are generated here and applied by src/migrate.ts as the owner role (OQ-004, OQ-005).
// Forward-only: rolling back means restoring from backup (OQ-036).
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dbCredentials: { url: process.env.DATABASE_MIGRATION_URL ?? "" },
});
