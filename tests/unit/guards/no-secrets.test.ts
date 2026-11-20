// Guard: no secrets committed in tracked files (Gate 5).
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const SECRET_NAME = /(key|password|passwd|secret|token)/i;
// name = "literal" / name: 'literal' with a quoted literal of 8+ chars
const ASSIGNMENT = /([A-Za-z0-9_]*)["']?\s*[:=]\s*["']([^"'\s]{8,})["']/g;
// URLs carrying a user and password before the host
const URL_PASSWORD = /[a-z][a-z0-9+.-]*:\/\/[^:/\s"']+:([^@/\s"']+)@/gi;
const PLACEHOLDERS = new Set(["change-me", "pip_test"]);
const SKIP = /(^|\/)(pnpm-lock\.yaml|snapshots\/|docs\/source\/)|\.(png|jpg|ico)$/;

function trackedFiles(): string[] {
  const out = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
    encoding: "utf8",
  });
  return out.split("\n").filter((f) => f && !SKIP.test(f));
}

describe("no secrets in source", () => {
  it("finds no secret-looking literals", () => {
    const hits: string[] = [];
    for (const file of trackedFiles()) {
      let text: string;
      try {
        text = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      for (const m of text.matchAll(ASSIGNMENT)) {
        const [, name = "", value = ""] = m;
        if (SECRET_NAME.test(name) && !PLACEHOLDERS.has(value) && !value.startsWith("${")) {
          hits.push(`${file}: ${name}`);
        }
      }
      for (const m of text.matchAll(URL_PASSWORD)) {
        const value = m[1] ?? "";
        if (!PLACEHOLDERS.has(value) && !value.startsWith("$")) hits.push(`${file}: password in URL`);
      }
    }
    expect(hits).toEqual([]);
  });
});
