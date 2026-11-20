# T-104 — Load and endurance

**Phase:** 9 — Testing · **Release:** R2 · **Status:** blocked (by T-051, T-004) · **Size:** M
**Satisfies:** NFR-13 · **Depends on:** T-051, T-004 · **Gated by:** —
**Files:** `tests/load/`, `tests/load/reports/`

## Goal

Load tests replay realistic event volume (OQ-003 targets) and an endurance run checks memory and queue depth over hours; reports kept in `tests/load/reports/`.

## Acceptance

- [ ] Burst at 10× average rate meets the p95 targets
- [ ] 8-hour run: no memory growth trend, queue drains
- [ ] Tests: `tests/load/events.k6.js`

## Notes

- 2026-11-20: created by bootstrap.
