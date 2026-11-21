// `make db-migrate`: create/update the app role and apply migrations as the owner (T-020).
import { runMigrations } from "../src/migrate.js";

const ownerUrl = process.env.DATABASE_MIGRATION_URL;
const appUrl = process.env.DATABASE_URL;
if (!ownerUrl || !appUrl) {
  console.error("DATABASE_MIGRATION_URL and DATABASE_URL must be set (see .env.example)");
  process.exit(1);
}
await runMigrations({ ownerUrl, appUrl });
console.log("migrations applied");
