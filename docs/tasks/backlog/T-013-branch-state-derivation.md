# T-013 — Branch state derivation

**Phase:** 2 — Domain · **Release:** R2 · **Status:** ready · **Size:** S
**Satisfies:** FR-4.9, BR-007, BR-009, BR-010 · **Depends on:** — · **Gated by:** —
**Files:** `packages/domain/src/branch-state.ts`

## Goal

A pure function derives a capability's state (canonical, active branch, merged, released) from its links to branches, PRs, merges and releases, never marking work done from commits or merges alone.

## Acceptance

- [ ] Unmerged branch work is `active_branch`, never counted as done (BR-007)
- [ ] A commit or a merge alone never changes task status to `done` (BR-009, BR-010)
- [ ] Release containing the merge commit → `released`
- [ ] Tests: `tests/unit/domain/branch-state.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
