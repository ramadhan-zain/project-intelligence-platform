# T-003 — Test github app and sample payloads

**Phase:** 0 — Unblock · **Release:** R2 · **Status:** ready · **Size:** S
**Satisfies:** tooling · **Depends on:** — · **Gated by:** —
**Files:** `tools/github_mock/fixtures/`, `docs/fsd/github-integration.md`

## Goal

A test GitHub organization with a test GitHub App and two test repositories exists, and one recorded webhook payload per consumed event is stored as a fixture for the mock and the tests.

## Acceptance

- [ ] Test App created with the permissions and events listed in `github-integration.md`
- [ ] Fixtures recorded for `installation_repositories`, `create`, `push`, `pull_request` (opened, synchronize, closed merged / unmerged), `pull_request_review`, `release`; secrets and personal data scrubbed
- [ ] App id / key / webhook secret stored outside git (`infra/.env`), names listed in `.env.example`
- [ ] Tests: fixtures load in `tests/contract/github-fixtures.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
