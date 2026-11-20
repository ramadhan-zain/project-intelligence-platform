# T-093 — Qa scenario generation

**Phase:** 6 — Workers / background · **Release:** R5 · **Status:** blocked (by T-084, T-090) · **Size:** L
**Satisfies:** FR-7.11 · **Depends on:** T-084, T-090 · **Gated by:** —
**Files:** `apps/worker/src/jobs/qa-scenarios.ts`

## Goal

Draft QA scenarios are generated from requirements and acceptance criteria and stored as agent-generated drafts until a QA engineer accepts them.

## Acceptance

- [ ] Drafts never count as test results
- [ ] Accepting a draft records the reviewer
- [ ] Tests: `tests/integration/worker/qa-scenarios.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
