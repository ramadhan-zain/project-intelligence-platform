# T-025 — Schema git activity

**Phase:** 3 — Persistence · **Release:** R2 · **Status:** blocked (by T-021) · **Size:** M
**Satisfies:** FR-2.7, FR-2.12, FR-2.13, FR-4.8 · **Depends on:** T-021 · **Gated by:** —
**Files:** `packages/db/src/schema/git.ts`

## Goal

Commits, branches, pull requests, releases and the task↔commit / task↔PR link tables (with link source) are stored; all relationships are optional per repository.

## Acceptance

- [ ] Relationship list of FR-2.12 representable; no FK forces a repository to provide any entity
- [ ] Changed files stored per commit; PR status history kept
- [ ] Link rows record their source (branch, message, description, adapter, manual)
- [ ] Tests: `tests/integration/db/git.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
