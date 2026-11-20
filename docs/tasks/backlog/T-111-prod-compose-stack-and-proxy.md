# T-111 — Prod compose stack and proxy

**Phase:** 10 — Deployment · **Release:** R1 · **Status:** blocked (by T-110) · **Size:** M
**Satisfies:** NFR-1 · **Depends on:** T-110 · **Gated by:** —
**Files:** `infra/prod/stack.yml`, `infra/caddy/Caddyfile`, `infra/compose.yml`

## Goal

The production stack (Caddy, web, api, worker, mcp, PostgreSQL, Redis) runs on one host with pinned image tags, and the stack-parity guard keeps it aligned with dev compose (D-002, OQ-024).

## Acceptance

- [ ] `docker compose -f infra/prod/stack.yml up -d` healthy on a clean VM
- [ ] Stack-parity guard test green
- [ ] Tests: `tests/unit/guards/stack-parity.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-20: bootstrap delivered `infra/prod/stack.yml`, Caddyfile and the stack-parity guard; remaining: clean-VM run.
