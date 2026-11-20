# T-055 — Sync recovery

**Phase:** 6 — Workers / background · **Release:** R2 · **Status:** blocked (by T-051, T-053) · **Size:** M
**Satisfies:** FR-3.20, AC-7 · **Depends on:** T-051, T-053 · **Gated by:** —
**Files:** `apps/worker/src/sync/recovery.ts`

## Goal

After Redis, GitHub or database outages, synchronization recovers without loss or duplication: events stored but not processed are re-enqueued, interrupted sync runs resume.

## Acceptance

- [ ] Kill worker mid-batch → restart → every stored event processed exactly once
- [ ] Redis down at intake → events kept as `pending_enqueue`, re-enqueued on recovery
- [ ] Tests: `tests/integration/worker/recovery.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
