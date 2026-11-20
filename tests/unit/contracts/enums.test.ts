import {
  CANONICAL_TASK_STATUSES,
  CanonicalTaskStatus,
  IntegrationMode,
  toDocumentCategory,
} from "@pip/contracts";
import { describe, expect, it } from "vitest";

describe("contracts enums", () => {
  it("has the seven canonical task statuses of FR-3.10", () => {
    expect(CANONICAL_TASK_STATUSES).toHaveLength(7);
    expect(CanonicalTaskStatus.safeParse("pending").success).toBe(false);
  });

  it("maps unknown document categories to custom (FR-3.12)", () => {
    expect(toDocumentCategory("architecture")).toBe("architecture");
    expect(toDocumentCategory("runbook")).toBe("custom");
  });

  it("defaults integration mode to hybrid (FR-3.8)", () => {
    expect(IntegrationMode.parse(undefined)).toBe("hybrid");
  });
});
