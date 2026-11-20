# T-094 — Cross project reporting

**Phase:** 8 — UI · **Release:** R5 · **Status:** blocked (by T-087, T-088) · **Size:** L
**Satisfies:** FR-12.5, AC-25 · **Depends on:** T-087, T-088 · **Gated by:** —
**Files:** `apps/web/src/app/(org)/reports/`

## Goal

Management views reports across all projects they are authorized for, never including projects outside their grants.

## Acceptance

- [ ] Report for a manager with access to 2 of 3 projects shows exactly those 2
- [ ] Tests: `tests/e2e/cross-project-reports.spec.ts`

## Notes

- 2026-11-20: created by bootstrap.
