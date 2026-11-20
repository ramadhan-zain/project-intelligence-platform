import { z } from "zod";

export const DependencyStatus = z.enum(["up", "down"]);

/** Body of GET /health on every service. */
export const HealthResponse = z.object({
  status: z.enum(["ok", "degraded", "down"]),
  service: z.string(),
  version: z.string(),
  dependencies: z.record(z.string(), DependencyStatus),
});
export type HealthResponse = z.infer<typeof HealthResponse>;
