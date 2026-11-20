# T-080 — Requirements management

**Phase:** 4 — Services / API · **Release:** R4 · **Status:** blocked (by T-026, T-070) · **Size:** L
**Satisfies:** FR-2.3, FR-5.6, FR-5.7, FR-5.11, AC-11, AC-12 · **Depends on:** T-026, T-070 · **Gated by:** —
**Files:** `apps/api/src/routes/requirements.ts`, `apps/web/src/app/(project)/requirements/`

## Goal

Requirements with codes, acceptance criteria, approval status and full version history can be created, approved and linked to tasks, in API and UI.

## Acceptance

- [ ] Approved version immutable; edits create a draft version
- [ ] Requirement ↔ task links visible from both sides
- [ ] Version history and diff shown
- [ ] Tests: `tests/integration/api/requirements.test.ts`, `tests/e2e/requirements.spec.ts`

## Notes

- 2026-11-20: created by bootstrap.
