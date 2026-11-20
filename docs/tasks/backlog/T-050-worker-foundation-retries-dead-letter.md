# T-050 — Worker foundation retries dead letter

**Phase:** 6 — Workers / background · **Release:** R1 · **Status:** blocked (by T-024) · **Size:** M
**Satisfies:** FR-9.11, FR-9.12, NFR-10 · **Depends on:** T-024 · **Gated by:** —
**Files:** `apps/worker/src/runtime/`

## Goal

The worker runs BullMQ queues with a tenant-scoped job runner (every job runs inside `withTenant`), exponential-backoff retries, a dead-letter table and a replay command.

## Acceptance

- [ ] Job without `organization_id` refused
- [ ] Job failing N times lands in `dead_letter_events` with error; `make replay-dead-letters` re-enqueues
- [ ] Permission checks in jobs use the same evaluator as the API
- [ ] Tests: `tests/integration/worker/runtime.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
