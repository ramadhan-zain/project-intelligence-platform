# T-095 — Gitlab provider adapter

**Phase:** 5 — Integrations · **Release:** R5 · **Status:** blocked (by T-040, T-051) · **Size:** L
**Satisfies:** FR-4.10 · **Depends on:** T-040, T-051 · **Gated by:** —
**Files:** `apps/api/src/routes/webhooks-gitlab.ts`, `apps/worker/src/providers/gitlab/`

## Goal

GitLab webhooks and API are integrated behind the same provider boundary as GitHub, with a mock and fixtures.

## Acceptance

- [ ] GitLab push / MR fixtures produce the same platform events as GitHub equivalents
- [ ] No GitLab-specific code outside the provider module
- [ ] Tests: `tests/integration/gitlab/webhooks.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
