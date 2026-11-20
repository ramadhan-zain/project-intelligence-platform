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
- 2026-11-20: UI reference from the product owner: a one-off task-progress dashboard of another project
  (static snapshot of its `docs/tasks/` folders). Worth keeping here:
  - headline tiles: % done, done of total, active, backlog split into ready / blocked / waiting;
  - progress per group as stacked bars (done / active / remaining) with "n of m · %" labels and tooltips;
  - a sentence summary above the tiles ("x % done; A leads, B trails; n ready to start");
  - a "How this is counted" panel, which is what the explain panel must be (FR-6.7).
  It also showed progress weighted by task size (S/M/L). Tasks have no size field and OQ-006 offers
  count or priority weighting only, so a size-weighted rule needs an OQ answer first; not in scope here.
  Missing from that reference and required here: milestones, blocked tasks, trend over time (from task
  history), live updates. Kanban and Gantt views: T-073, T-078 (D-006).
