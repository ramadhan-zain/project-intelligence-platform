# T-087 — Structured reports

**Phase:** 6 — Workers / background · **Release:** R4 · **Status:** blocked (by T-051, T-080) · **Size:** L
**Satisfies:** FR-12.3, FR-12.4, FR-11.6 · **Depends on:** T-051, T-080 · **Gated by:** —
**Files:** `apps/worker/src/jobs/reports/`

## Goal

Daily, weekly, milestone, requirement-change, outstanding-approval and QA-status reports, plus the generated overview documents, are built from structured records on schedule (OQ-029) without LLM calls.

## Acceptance

- [ ] Each report type generated from seed data; stored as `generated` documents
- [ ] No report path imports the LLM provider module
- [ ] Tests: `tests/integration/worker/reports.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
