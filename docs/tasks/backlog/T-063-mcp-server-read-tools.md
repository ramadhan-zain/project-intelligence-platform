# T-063 — Mcp server read tools

**Phase:** 4 — Services / API · **Release:** R3 · **Status:** blocked (by T-060, T-062) · **Size:** M
**Satisfies:** FR-8.1, AC-14, AC-15, AC-19, NFR-10 · **Depends on:** T-060, T-062 · **Gated by:** —
**Files:** `apps/mcp/src/`, `packages/contracts/src/mcp/`, `docs/fsd/mcp-tools-contract.md`

## Goal

The MCP server exposes the eight read tools over Streamable HTTP with API-token auth, each calling the shared context service, so Claude Code can load project and repository context.

## Acceptance

- [ ] Claude Code connects with the documented config and lists all eight tools
- [ ] Each tool returns items with provenance; denied scopes return an MCP error, not empty data
- [ ] MCP tools contract frozen at 1.0 (T-063)
- [ ] Tests: `tests/integration/mcp/read-tools.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
