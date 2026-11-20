# T-039 — Audit log service

**Phase:** 4 — Services / API · **Release:** R1 · **Status:** blocked (by T-024) · **Size:** S
**Satisfies:** FR-10.5, AC-30 · **Depends on:** T-024 · **Gated by:** —
**Files:** `apps/api/src/services/audit.ts`

## Goal

Every sensitive write listed in OQ-030 records actor, action, target, before / after and time, through one service used by REST, MCP and worker paths.

## Acceptance

- [ ] Each OQ-030 action has a test asserting an audit row
- [ ] Audit read endpoint for org admins only
- [ ] Tests: `tests/integration/api/audit.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
