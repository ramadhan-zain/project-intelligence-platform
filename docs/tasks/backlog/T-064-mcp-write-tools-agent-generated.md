# T-064 — Mcp write tools agent generated

**Phase:** 4 — Services / API · **Release:** R3 · **Status:** blocked (by T-063, T-034) · **Size:** M
**Satisfies:** FR-8.2, FR-8.3, FR-8.5, BR-012, AC-16, AC-17 · **Depends on:** T-063, T-034 · **Gated by:** —
**Files:** `apps/mcp/src/tools/write/`

## Goal

The write tools update task status, add notes, publish progress, create change requests (stub until T-081) and submit implementation summaries, each checking authorization and source ownership and marking output agent-generated.

## Acceptance

- [ ] `update_task_status` on a source-owned task refused with reason
- [ ] Every write stored with `origin = agent` and shown as agent-generated until accepted
- [ ] Writes audited
- [ ] Tests: `tests/integration/mcp/write-tools.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
