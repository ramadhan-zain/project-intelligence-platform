import { readFileSync } from "node:fs";

/** Release version: RELEASE_VERSION (set by the image build) or this package's version (one version, D-003). */
export function releaseVersion(): string {
  if (process.env.RELEASE_VERSION) return process.env.RELEASE_VERSION;
  const pkg = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8")) as {
    version: string;
  };
  return pkg.version;
}
