# T-053 — Incremental and scheduled sync

**Phase:** 6 — Workers / background · **Release:** R2 · **Status:** blocked (by T-052) · **Size:** M
**Satisfies:** FR-3.16, FR-3.8 · **Depends on:** T-052 · **Gated by:** —
**Files:** `apps/worker/src/sync/incremental.ts`, `apps/worker/src/sync/schedule.ts`

## Goal

Pushes trigger incremental sync of changed sources only, and a scheduled consistency pull (OQ-017) reconciles drift in hybrid mode.

## Acceptance

- [ ] Push changing one doc re-reads only that doc
- [ ] Scheduled run detects a change missed by webhooks and applies it
- [ ] Hybrid is the default mode for new integrations
- [ ] Tests: `tests/integration/worker/incremental-sync.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
