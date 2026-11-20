// /health against real PostgreSQL and Redis from infra/docker-compose.test.yml (make test-integration).
import { buildServer } from "@pip/api/server";
import { createSql, pingDatabase } from "@pip/db";
import { Redis } from "ioredis";
import { afterAll, describe, expect, it } from "vitest";

const sql = createSql(
  process.env.TEST_DATABASE_URL ?? "postgres://pip_test:pip_test@localhost:55432/pip_test",
);
const redis = new Redis(process.env.TEST_REDIS_URL ?? "redis://localhost:56379", { maxRetriesPerRequest: 1 });

afterAll(async () => {
  await sql.end({ timeout: 5 });
  redis.disconnect();
});

describe("GET /health", () => {
  it("reports every dependency up and the release version", async () => {
    const app = buildServer({
      checks: {
        postgres: () => pingDatabase(sql),
        redis: async () => (await redis.ping()) === "PONG",
      },
    });
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.headers["x-release-version"]).toMatch(/^\d+\.\d+\.\d+/);
    expect(res.json()).toMatchObject({ status: "ok", dependencies: { postgres: "up", redis: "up" } });
    await app.close();
  });

  it("answers 503 when a dependency is down", async () => {
    const app = buildServer({ checks: { postgres: async () => false } });
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(503);
    expect(res.json()).toMatchObject({ status: "down", dependencies: { postgres: "down" } });
    await app.close();
  });
});
