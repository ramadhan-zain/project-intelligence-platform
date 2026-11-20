# T-038 — Sse hub with permission filter

**Phase:** 4 — Services / API · **Release:** R1 · **Status:** blocked (by T-024, T-017) · **Size:** M
**Satisfies:** FR-9.10, FR-9.13, FR-9.14, NFR-17 · **Depends on:** T-024, T-017 · **Gated by:** —
**Files:** `apps/api/src/sse/`

## Goal

The API streams project changes over SSE, fed by PostgreSQL LISTEN/NOTIFY, and sends each subscriber only changes they may read right now.

## Acceptance

- [ ] Change committed by the worker reaches a subscribed client within 2 s locally
- [ ] Subscriber without access to the project receives nothing
- [ ] Revoking membership stops delivery without reconnect (checked per message or on revocation event)
- [ ] Tests: `tests/integration/api/sse.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
