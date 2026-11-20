import { z } from "zod";
import { CanonicalTaskStatus, DocumentCategory } from "./enums.js";
import { HealthResponse } from "./health.js";

/**
 * Every schema whose JSON Schema is snapshotted in packages/contracts/snapshots/.
 * Add an entry when a contract task (T-010, T-011, T-012, T-063) adds a schema.
 */
export const SNAPSHOT_SCHEMAS: Record<string, z.ZodType> = {
  "canonical-task-status": CanonicalTaskStatus,
  "document-category": DocumentCategory,
  "health-response": HealthResponse,
};

export function toJsonSchema(schema: z.ZodType): unknown {
  return z.toJSONSchema(schema, { target: "draft-2020-12" });
}
