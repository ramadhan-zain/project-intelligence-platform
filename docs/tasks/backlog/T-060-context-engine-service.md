# T-060 — Context engine service

**Phase:** 4 — Services / API · **Release:** R3 · **Status:** blocked (by T-022, T-023, T-025) · **Size:** L
**Satisfies:** FR-7.1, FR-7.2, FR-7.3, FR-7.4, NFR-5 · **Depends on:** T-022, T-023, T-025 · **Gated by:** —
**Files:** `apps/api/src/services/context/`

## Goal

A context engine assembles minimal, structured context (project overview, repository context, tasks, activity, related requirements, decisions, conventions, deployment docs) from records only, with every filter of FR-7.4 and the caller's permissions.

## Acceptance

- [ ] Each FR-7.3 operation implemented as a service function used by REST and MCP
- [ ] Responses size-bounded (limits, summaries of lists, document refs instead of full bodies by default)
- [ ] No LLM call and no provider-specific code in the module
- [ ] Tests: `tests/integration/context/context-engine.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
