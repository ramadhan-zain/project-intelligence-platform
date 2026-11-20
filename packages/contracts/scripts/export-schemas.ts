// Writes packages/contracts/snapshots/<name>.schema.json for every SNAPSHOT_SCHEMAS entry.
// Run `make schemas` after an intended contract change; the contract test fails until you do.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SNAPSHOT_SCHEMAS, toJsonSchema } from "../src/index.js";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "snapshots");
mkdirSync(dir, { recursive: true });
for (const [name, schema] of Object.entries(SNAPSHOT_SCHEMAS)) {
  writeFileSync(join(dir, `${name}.schema.json`), `${JSON.stringify(toJsonSchema(schema), null, 2)}\n`);
  console.log(`wrote snapshots/${name}.schema.json`);
}
