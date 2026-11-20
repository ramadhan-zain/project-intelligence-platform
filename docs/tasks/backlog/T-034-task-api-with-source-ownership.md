# T-034 — Task api with source ownership

**Phase:** 4 — Services / API · **Release:** R1 · **Status:** blocked (by T-022, T-016) · **Size:** M
**Satisfies:** FR-5.1, FR-5.2, FR-5.3, FR-5.4, FR-5.5, FR-8.3 · **Depends on:** T-022, T-016 · **Gated by:** —
**Files:** `apps/api/src/routes/tasks.ts`, `apps/api/src/services/tasks.ts`

## Goal

Platform-native tasks can be created and updated (assignment, status, priority, labels, start and due date, dependencies, comments) with history; edits to fields owned by an external source are refused with a clear reason.

## Acceptance

- [ ] `PATCH` of `status` on a Markdown-sourced task → 409 `source_owned`
- [ ] History endpoint returns version rows
- [ ] Dependency cycles refused
- [ ] `start_date` editable on platform-native tasks; `start_date` after `due_date` refused (OQ-035)
- [ ] Tests: `tests/integration/api/tasks.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-20: `start_date` added for the Gantt view (D-006, OQ-035).
