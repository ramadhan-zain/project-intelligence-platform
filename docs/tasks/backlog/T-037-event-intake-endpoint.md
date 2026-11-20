# T-037 — Event intake endpoint

**Phase:** 4 — Services / API · **Release:** R2 · **Status:** blocked (by T-010, T-024, T-027) · **Size:** M
**Satisfies:** FR-9.3, FR-9.4, FR-9.5, FR-9.6, FR-9.7, FR-3.6, NFR-7 · **Depends on:** T-010, T-024, T-027 · **Gated by:** —
**Files:** `apps/api/src/routes/integration-events.ts`

## Goal

`POST /api/integrations/events` authenticates the integration token, checks scope, validates the envelope, stores the raw event deduplicated and enqueues it, answering per the event contract.

## Acceptance

- [ ] Responses 202 / 400 / 401 / 403 / 503 exactly as `event-envelope-contract.md`
- [ ] Same event sent twice → stored once, second reported in `duplicates`
- [ ] Token for project A cannot post into project B
- [ ] Tests: `tests/integration/api/integration-events.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
