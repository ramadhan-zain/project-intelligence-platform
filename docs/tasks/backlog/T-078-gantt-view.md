# T-078 — Gantt view

**Phase:** 8 — UI · **Release:** R1 · **Status:** blocked (by T-073, T-034) · **Size:** M
**Satisfies:** FR-5.13 · **Depends on:** T-073, T-034 · **Gated by:** —
**Files:** `apps/web/src/app/(project)/gantt/`

## Goal

A Gantt view shows the project schedule: tasks as bars from start to due date, grouped by milestone,
with milestone markers and dependency links (D-006). Bar dates follow OQ-035.

## Acceptance

- [ ] Bars grouped by milestone; milestone target dates drawn as markers; a "today" line
- [ ] Dependency links drawn between tasks (`task_dependencies`); blocked and overdue tasks highlighted
- [ ] Task without a start date uses the derived start (first move to `in_progress`); due date only → marker; neither → "Unscheduled" lane
- [ ] Same filters as the task board; day / week / month zoom; clicking a bar opens task detail
- [ ] Dragging a bar changes `start_date` / `due_date` only on platform-native tasks; source-owned bars are locked with the reason shown
- [ ] Live updates via SSE
- [ ] Tests: `tests/e2e/gantt.spec.ts`

## Notes

- 2026-11-20: created after D-006 (product owner asked for Kanban and Gantt views).
