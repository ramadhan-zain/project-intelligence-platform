// Docker HEALTHCHECK for the worker: exits 0 when Redis answers PING.
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  connectTimeout: 2_000,
});
const ok = (await redis.ping().catch(() => "")) === "PONG";
redis.disconnect();
process.exit(ok ? 0 : 1);
