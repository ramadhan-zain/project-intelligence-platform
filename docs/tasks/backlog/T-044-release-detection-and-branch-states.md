# T-044 — Release detection and branch states

**Phase:** 5 — Integrations · **Release:** R2 · **Status:** blocked (by T-013, T-042) · **Size:** S
**Satisfies:** FR-4.9, BR-007 · **Depends on:** T-013, T-042 · **Gated by:** —
**Files:** `apps/worker/src/processors/git-release.ts`

## Goal

Release events mark merged work as released, and branch / merged / released states are stored per task for the dashboards.

## Acceptance

- [ ] Release fixture marks only commits reachable from the tag
- [ ] Task with only an open PR shows `active_branch`, never complete
- [ ] Tests: `tests/integration/github/releases.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
