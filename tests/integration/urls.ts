// Throwaway credentials of infra/docker-compose.test.yml — test-only, not secrets.
export const TEST_OWNER_URL =
  process.env.TEST_DATABASE_MIGRATION_URL ?? "postgres://pip_test:pip_test@localhost:55432/pip_test";
export const TEST_APP_URL =
  process.env.TEST_APP_DATABASE_URL ?? "postgres://pip_app:pip_test@localhost:55432/pip_test";
