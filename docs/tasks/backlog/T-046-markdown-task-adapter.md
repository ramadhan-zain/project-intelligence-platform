# T-046 — Markdown task adapter

**Phase:** 5 — Integrations · **Release:** R2 · **Status:** blocked (by T-011, T-014, T-006) · **Size:** M
**Satisfies:** FR-3.13, FR-3.10, AC-2, AC-3 · **Depends on:** T-011, T-014, T-006 · **Gated by:** —
**Files:** `apps/worker/src/adapters/markdown-tasks/`

## Goal

A built-in adapter parses Markdown task files using the configured id pattern, title / description mapping and status mapping, yielding canonical tasks with source references.

## Acceptance

- [ ] `repo-a/BACKLOG.md` and `repo-b/TASKS.md` both parse with their own mappings
- [ ] Line / heading anchor stored as source reference
- [ ] Unparseable entries reported in diagnostics, not dropped silently
- [ ] Tests: `tests/unit/adapters/markdown-tasks.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
