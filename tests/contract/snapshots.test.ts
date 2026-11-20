// Contract snapshot: generated JSON Schema must match the committed snapshot.
// Intended change → `make schemas` and commit the diff (it shows in review).
import { existsSync, readFileSync } from "node:fs";
import { SNAPSHOT_SCHEMAS, toJsonSchema } from "@pip/contracts";
import { describe, expect, it } from "vitest";

describe("contract snapshots", () => {
  it.each(Object.keys(SNAPSHOT_SCHEMAS))("%s matches its snapshot", (name) => {
    const path = `packages/contracts/snapshots/${name}.schema.json`;
    expect(existsSync(path), `${path} missing — run make schemas`).toBe(true);
    const committed = JSON.parse(readFileSync(path, "utf8"));
    expect(toJsonSchema(SNAPSHOT_SCHEMAS[name] as never)).toEqual(committed);
  });
});
