// Guard: dev compose and prod stack run the same services, images and commands (D-002, T-111).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

type Service = { image?: string; build?: unknown; command?: unknown };
const load = (path: string) =>
  (parse(readFileSync(path, "utf8"), { merge: true }) as { services: Record<string, Service> }).services;

const dev = load("infra/compose.yml");
const prod = load("infra/prod/stack.yml");

describe("stack parity", () => {
  it("has the same services", () => {
    expect(Object.keys(prod).sort()).toEqual(Object.keys(dev).sort());
  });

  it.each(Object.keys(dev))("%s uses the same image and command", (name) => {
    const d = dev[name] as Service;
    const p = prod[name] as Service;
    if (d.image) expect(p.image).toBe(d.image);
    else expect(p.image).toMatch(new RegExp(`/pip-${name}:\\$\\{PIP_VERSION\\}$`));
    expect(p.command).toEqual(d.command);
  });
});
