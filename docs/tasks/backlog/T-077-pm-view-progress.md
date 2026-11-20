# T-077 — Pm view progress

**Phase:** 8 — UI · **Release:** R1 · **Status:** blocked (by T-073, T-018) · **Size:** M
**Satisfies:** FR-6.2, FR-6.7, AC-13 · **Depends on:** T-073, T-018 · **Gated by:** —
**Files:** `apps/web/src/app/(project)/overview/`

## Goal

A PM overview shows progress with the rule and inputs that produced it, task distribution, milestones and blocked tasks (approvals, requirement changes and risks join in T-088).

## Acceptance

- [ ] Progress figure has an "explain" panel listing rule and counted tasks
- [ ] Changing the project's progress rule changes the figure and the explanation
- [ ] Tests: `tests/e2e/pm-view.spec.ts`

## Notes

- 2026-11-20: created by bootstrap.
