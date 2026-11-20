# T-015 — Task id extraction

**Phase:** 2 — Domain · **Release:** R2 · **Status:** ready · **Size:** S
**Satisfies:** FR-4.6, BR-017 · **Depends on:** — · **Gated by:** —
**Files:** `packages/domain/src/task-links.ts`

## Goal

Task ids are extracted from branch names, commit messages and PR text with the project's id patterns, each link carrying its source kind, and explicit adapter / manual links always take precedence.

## Acceptance

- [ ] `feature/TASK-102-authentication` and `feat(auth): … [TASK-102]` both yield TASK-102 with the right link source
- [ ] Several patterns per project (one per repository adapter) supported
- [ ] Manual and adapter links override and survive re-extraction
- [ ] Tests: `tests/unit/domain/task-links.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
