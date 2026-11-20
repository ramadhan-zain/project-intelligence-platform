// Posts a recorded GitHub webhook fixture to the API with a valid X-Hub-Signature-256.
// Usage: node --import tsx tools/github_mock/src/send.ts <fixture-name> [event-name]
// Grows into the full mock (replay + contents API) with T-045; fixtures recorded in T-003.
import { createHmac, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [fixture = "ping", event = fixture] = process.argv.slice(2);
const secret = process.env.GITHUB_WEBHOOK_SECRET;
if (!secret) throw new Error("GITHUB_WEBHOOK_SECRET is not set");
const url = process.env.WEBHOOK_URL ?? "http://localhost:8088/api/webhooks/github";

const body = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures", `${fixture}.json`));
const signature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

const res = await fetch(url, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-github-event": event,
    "x-github-delivery": randomUUID(),
    "x-hub-signature-256": signature,
  },
  body,
});
console.log(`${fixture}: ${res.status} ${await res.text()}`);
