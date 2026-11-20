# T-076 — Developer view

**Phase:** 8 — UI · **Release:** R3 · **Status:** blocked (by T-073, T-060) · **Size:** M
**Satisfies:** FR-6.1 · **Depends on:** T-073, T-060 · **Gated by:** —
**Files:** `apps/web/src/app/(project)/developer/`

## Goal

A developer home shows assigned tasks, technical context and architecture docs, active branches and PRs, related requirements, decisions, and how to connect an agent (MCP config and token).

## Acceptance

- [ ] Every FR-6.1 item present with data from the dev seed
- [ ] "Connect Claude Code" panel creates a token and shows the MCP config once
- [ ] Tests: `tests/e2e/developer-view.spec.ts`

## Notes

- 2026-11-20: created by bootstrap.
