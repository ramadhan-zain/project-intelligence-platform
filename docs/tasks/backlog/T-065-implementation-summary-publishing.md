# T-065 — Implementation summary publishing

**Phase:** 4 — Services / API · **Release:** R3 · **Status:** blocked (by T-064, T-037) · **Size:** S
**Satisfies:** FR-8.7 · **Depends on:** T-064, T-037 · **Gated by:** —
**Files:** `apps/api/src/services/implementation-summaries.ts`

## Goal

Implementation summaries arrive via MCP, REST and the `implementation.summary` event and are linked to the task, its PR and commits.

## Acceptance

- [ ] Same summary through any of the three paths yields one linked record
- [ ] Visible on task detail as agent-generated
- [ ] Tests: `tests/integration/api/implementation-summaries.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
