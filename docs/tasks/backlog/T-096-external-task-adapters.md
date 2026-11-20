# T-096 — External task adapters

**Phase:** 5 — Integrations · **Release:** R5 · **Status:** blocked (by T-051) · **Size:** L
**Satisfies:** FR-13.1 · **Depends on:** T-051 · **Gated by:** —
**Files:** `apps/worker/src/adapters/github-issues/`, `apps/worker/src/adapters/linear/`

## Goal

GitHub Issues (then Linear, Jira) can be the task source of a repository through adapters with status mapping.

## Acceptance

- [ ] GitHub Issues adapter maps labels / state to canonical status with original value kept
- [ ] Mixed project: one repo Markdown tasks, one repo GitHub Issues
- [ ] Tests: `tests/integration/adapters/github-issues.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
