import { createSql, pingDatabase } from "@pip/db";
import { Redis } from "ioredis";
import { buildServer } from "./server.js";

const sql = createSql();
const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
});

const app = buildServer({
  logger: true,
  checks: {
    postgres: () => pingDatabase(sql),
    redis: async () => (await redis.ping().catch(() => "")) === "PONG",
  },
});

const port = Number(process.env.API_PORT ?? 3001);
await app.listen({ host: "0.0.0.0", port });

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await app.close();
    await sql.end({ timeout: 5 });
    redis.disconnect();
    process.exit(0);
  });
}
