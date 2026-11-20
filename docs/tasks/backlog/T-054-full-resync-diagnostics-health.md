# T-054 — Full resync diagnostics health

**Phase:** 6 — Workers / background · **Release:** R2 · **Status:** blocked (by T-052) · **Size:** M
**Satisfies:** FR-3.17, FR-3.18, FR-3.19 · **Depends on:** T-052 · **Gated by:** —
**Files:** `apps/worker/src/sync/full.ts`, `apps/api/src/routes/integration-health.ts`

## Goal

Admins can trigger a full resync; each integration exposes health (`ok` / `degraded` / `down`), last runs, errors, warnings and the adapter version it runs.

## Acceptance

- [ ] Full resync reconciles and marks removed source items without deleting history
- [ ] Diagnostics list unmapped statuses and unparseable entries
- [ ] Adapter version stored per integration and shown
- [ ] Tests: `tests/integration/worker/full-resync.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
