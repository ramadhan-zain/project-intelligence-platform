import { QUEUES } from "@pip/contracts";
import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { releaseVersion } from "./lib/version.js";

// Event processing arrives with T-050 / T-051. Until then the worker consumes and logs.
const connection = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  QUEUES.events,
  async (job) => {
    console.log(JSON.stringify({ msg: "event job received", id: job.id, name: job.name }));
  },
  { connection },
);

console.log(JSON.stringify({ msg: "worker started", version: releaseVersion(), queue: QUEUES.events }));

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await worker.close();
    connection.disconnect();
    process.exit(0);
  });
}
