// Vitest globalSetup for integration tests: create the app role and apply migrations as the owner (T-020).
// globalSetup does not get the `source` resolve condition, so import the source file directly.
import { runMigrations } from "../../packages/db/src/migrate.js";
import { TEST_APP_URL, TEST_OWNER_URL } from "./urls.js";

export default async function setup(): Promise<void> {
  await runMigrations({ ownerUrl: TEST_OWNER_URL, appUrl: TEST_APP_URL });
}
