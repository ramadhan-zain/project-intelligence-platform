# T-101 — Tenant isolation suite

**Phase:** 9 — Testing · **Release:** R1 · **Status:** blocked (by T-021, T-063, T-050) · **Size:** M
**Satisfies:** NFR-6, NFR-10, FR-10.2, AC-19, AC-26 · **Depends on:** T-021, T-063, T-050 · **Gated by:** —
**Files:** `tests/integration/security/isolation.test.ts`

## Goal

A suite seeds two organizations and proves no path — REST, MCP, SSE, background jobs, raw SQL as the app role — returns data of the other organization.

## Acceptance

- [ ] Every list / get route and MCP tool exercised with a foreign id
- [ ] Job with org A context cannot read org B rows
- [ ] Suite runs in CI integration job
- [ ] Tests: `tests/integration/security/isolation.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
