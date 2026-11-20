# T-062 — Api tokens

**Phase:** 4 — Services / API · **Release:** R3 · **Status:** blocked (by T-027, T-030) · **Size:** S
**Satisfies:** FR-8.5, NFR-17 · **Depends on:** T-027, T-030 · **Gated by:** —
**Files:** `apps/api/src/routes/tokens.ts`

## Goal

Users create, list and revoke personal API tokens bound to one organization and scope, used by agents for REST and MCP.

## Acceptance

- [ ] Revoked token refused on the very next request (REST and MCP)
- [ ] Token creation and revocation audited
- [ ] Tests: `tests/integration/api/tokens.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
