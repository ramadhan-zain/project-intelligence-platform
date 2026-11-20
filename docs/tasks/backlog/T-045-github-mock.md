# T-045 — Github mock

**Phase:** 5 — Integrations · **Release:** R2 · **Status:** blocked (by T-003) · **Size:** S
**Satisfies:** tooling · **Depends on:** T-003 · **Gated by:** —
**Files:** `tools/github_mock/`

## Goal

A local GitHub mock replays recorded webhook fixtures with valid signatures to the API and serves the few GitHub REST endpoints the worker reads (contents, compare), for dev and CI.

## Acceptance

- [ ] `make mock-github-push` (and one target per fixture) posts a signed fixture
- [ ] Contents endpoint serves files from `tests/fixtures/repos/*`
- [ ] Used by integration tests in CI; no network to github.com needed
- [ ] Tests: `tests/integration/github/mock.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
