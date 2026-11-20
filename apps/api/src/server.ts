import { type HealthResponse, RELEASE_VERSION_HEADER } from "@pip/contracts";
import Fastify, { type FastifyInstance } from "fastify";
import { releaseVersion } from "./lib/version.js";

export type DependencyCheck = () => Promise<boolean>;

export interface ServerDeps {
  /** Named dependency checks reported by /health, e.g. { postgres, redis }. */
  checks: Record<string, DependencyCheck>;
  logger?: boolean;
}

const HEALTH_CACHE_MS = 2_000;

export function buildServer(deps: ServerDeps): FastifyInstance {
  const app = Fastify({ logger: deps.logger ?? false });
  const version = releaseVersion();
  let cached: { at: number; body: HealthResponse } | undefined;

  // Per-dependency status, cached briefly so probes cannot overload the database (Gate 7, T-112).
  app.get("/health", async (_req, reply) => {
    if (!cached || Date.now() - cached.at > HEALTH_CACHE_MS) {
      const entries = await Promise.all(
        Object.entries(deps.checks).map(
          async ([name, check]) => [name, (await check()) ? "up" : "down"] as const,
        ),
      );
      const dependencies = Object.fromEntries(entries);
      const allUp = entries.every(([, s]) => s === "up");
      cached = {
        at: Date.now(),
        body: { status: allUp ? "ok" : "down", service: "api", version, dependencies },
      };
    }
    reply.header(RELEASE_VERSION_HEADER, version);
    reply.code(cached.body.status === "ok" ? 200 : 503);
    return cached.body;
  });

  return app;
}
