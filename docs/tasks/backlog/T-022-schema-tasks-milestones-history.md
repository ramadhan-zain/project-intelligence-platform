# T-022 — Schema tasks milestones history

**Phase:** 3 — Persistence · **Release:** R1 · **Status:** blocked (by T-021) · **Size:** M
**Satisfies:** FR-2.2, FR-2.11, FR-2.14, FR-5.5 · **Depends on:** T-021 · **Gated by:** —
**Files:** `packages/db/src/schema/tasks.ts`

## Goal

Tasks (with type, labels, original status, source reference), task versions, comments, dependencies and milestones are stored, and every task update writes a version row in the same transaction.

## Acceptance

- [ ] Columns cover FR-2.2 plus `original_status`, `type`, `labels`, `milestone_id`, `source_*`, nullable `start_date` (OQ-035)
- [ ] Update helper writes `task_versions` atomically
- [ ] Unique `(project_id, source, external_id)` prevents duplicates
- [ ] Tests: `tests/integration/db/tasks.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-20: `start_date` added for the Gantt view (D-006, OQ-035).
