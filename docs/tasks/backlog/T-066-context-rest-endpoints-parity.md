# T-066 — Context rest endpoints parity

**Phase:** 4 — Services / API · **Release:** R3 · **Status:** blocked (by T-060) · **Size:** S
**Satisfies:** FR-8.4, NFR-11 · **Depends on:** T-060 · **Gated by:** —
**Files:** `apps/api/src/routes/context.ts`

## Goal

Every MCP read tool has a REST equivalent under `/api/projects/:projectId/context/*`, so MCP is not the only machine interface.

## Acceptance

- [ ] Parity test: same inputs → same payload via REST and MCP
- [ ] OpenAPI snapshot updated
- [ ] Tests: `tests/integration/context/parity.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
