import { z } from "zod";

/** Canonical task statuses (FR-3.10, source §4.6). */
export const CANONICAL_TASK_STATUSES = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "blocked",
  "done",
  "cancelled",
] as const;
export const CanonicalTaskStatus = z.enum(CANONICAL_TASK_STATUSES);
export type CanonicalTaskStatus = z.infer<typeof CanonicalTaskStatus>;

/** Document categories (FR-3.12, source §4.7). Unknown categories become `custom`. */
export const DOCUMENT_CATEGORIES = [
  "overview",
  "architecture",
  "requirements",
  "specification",
  "agent_instructions",
  "technical_decision",
  "development_notes",
  "deployment",
  "testing",
  "release_notes",
  "custom",
] as const;
export const DocumentCategory = z.enum(DOCUMENT_CATEGORIES);
export type DocumentCategory = z.infer<typeof DocumentCategory>;

/** Integration modes (FR-3.6–FR-3.8). Hybrid is the default. */
export const INTEGRATION_MODES = ["push", "pull", "hybrid"] as const;
export const IntegrationMode = z.enum(INTEGRATION_MODES).default("hybrid");
export type IntegrationMode = z.infer<typeof IntegrationMode>;

/** Maps any category string to a known one; unknown values become `custom` (FR-3.12). */
export function toDocumentCategory(value: string): DocumentCategory {
  const parsed = DocumentCategory.safeParse(value);
  return parsed.success ? parsed.data : "custom";
}
