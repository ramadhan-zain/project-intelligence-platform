# T-040 — Github app webhook intake

**Phase:** 5 — Integrations · **Release:** R2 · **Status:** blocked (by T-024, T-045) · **Size:** M
**Satisfies:** FR-4.1, FR-4.2, FR-4.3, NFR-9 · **Depends on:** T-024, T-045 · **Gated by:** —
**Files:** `apps/api/src/routes/webhooks-github.ts`, `docs/fsd/github-integration.md`

## Goal

GitHub App webhooks are received, signature-verified on the raw body, deduplicated by delivery id, mapped to platform events and enqueued; installation events connect repositories.

## Acceptance

- [ ] Bad / missing signature → 401 before JSON parsing
- [ ] Redelivered `X-GitHub-Delivery` stored once
- [ ] Every event in the mapping table produces the listed platform event (mock fixtures)
- [ ] GitHub integration doc frozen at 1.0 (T-040)
- [ ] Tests: `tests/integration/github/webhooks.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
