# T-012 — Rest api base contract and client

**Phase:** 1 — Contracts · **Release:** R1 · **Status:** ready · **Size:** M
**Satisfies:** FR-8.4 · **Depends on:** — · **Gated by:** —
**Files:** `packages/contracts/src/api/`, `packages/contracts/src/client.ts`, `apps/api/src/openapi.ts`

## Goal

The REST conventions (error shape, pagination, auth headers) and a typed client exist in `packages/contracts`, and the API generates an OpenAPI document whose snapshot is checked in review.

## Acceptance

- [ ] Error and list envelopes defined once and used by the API's error handler
- [ ] Typed client calls `/health` and one list route with correct types
- [ ] `openapi.json` snapshot test fails when a route schema changes; contract doc frozen at 1.0 (T-012)
- [ ] Tests: `tests/unit/contracts/client.test.ts`, `tests/contract/openapi.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
