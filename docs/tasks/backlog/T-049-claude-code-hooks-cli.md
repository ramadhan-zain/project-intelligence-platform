# T-049 — Claude code hooks cli

**Phase:** 5 — Integrations · **Release:** R3 · **Status:** blocked (by T-037) · **Size:** M
**Satisfies:** FR-8.6, FR-3.2, FR-3.6 · **Depends on:** T-037 · **Gated by:** —
**Files:** `packages/cli/`, `docs/integrations/claude-code.md`

## Goal

A `pip-sync` CLI posts envelopes (progress, task updates, implementation summaries) with an integration token, and a documented Claude Code hooks snippet calls it from any repository.

## Acceptance

- [ ] `pip-sync publish-progress --task TASK-1 --summary …` posts a valid envelope; retries on 503
- [ ] Example `.claude/settings.json` hook snippet documented and tested against the dev stack
- [ ] CLI never sends repository content beyond what the command names
- [ ] Tests: `tests/unit/cli/pip-sync.test.ts`, `tests/integration/cli/publish.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
