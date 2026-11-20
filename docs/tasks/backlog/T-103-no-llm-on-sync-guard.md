# T-103 — No llm on sync guard

**Phase:** 9 — Testing · **Release:** R2 · **Status:** blocked (by T-051) · **Size:** S
**Satisfies:** NFR-3, AC-18 · **Depends on:** T-051 · **Gated by:** —
**Files:** `tests/unit/guards/no-llm.test.ts`, `.dependency-cruiser.cjs`

## Goal

A guard proves ordinary Git and task sync never calls an LLM: dependency rules forbid sync modules from importing the LLM package, and an integration run with outbound network blocked passes.

## Acceptance

- [ ] Dependency rule fails CI on a forbidden import
- [ ] Full sync of fixtures passes with LLM env vars unset
- [ ] Tests: `tests/unit/guards/no-llm.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
