# T-043 — Task association

**Phase:** 5 — Integrations · **Release:** R2 · **Status:** blocked (by T-015, T-041, T-042) · **Size:** M
**Satisfies:** FR-4.6, FR-4.7, BR-017 · **Depends on:** T-015, T-041, T-042 · **Gated by:** —
**Files:** `apps/worker/src/processors/task-links.ts`, `apps/api/src/routes/task-links.ts`

## Goal

Commits, branches and PRs are linked to tasks automatically from names / messages / descriptions and adapter links, and users can add or remove links manually.

## Acceptance

- [ ] Branch, commit and PR fixtures produce links with the right source
- [ ] Manual link via API survives re-sync; manual unlink is not re-created automatically
- [ ] Tests: `tests/integration/github/task-links.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
