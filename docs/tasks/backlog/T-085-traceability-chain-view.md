# T-085 — Traceability chain view

**Phase:** 8 — UI · **Release:** R4 · **Status:** blocked (by T-080, T-084, T-044) · **Size:** L
**Satisfies:** FR-5.10 · **Depends on:** T-080, T-084, T-044 · **Gated by:** —
**Files:** `apps/web/src/app/(project)/requirements/[id]/trace/`

## Goal

Each requirement shows its chain: design specification (OQ-031) → tasks → branches / PRs → merged → QA results → client acceptance, with gaps highlighted.

## Acceptance

- [ ] Chain renders from seed data with every link type
- [ ] Missing link shown as a gap, not hidden
- [ ] Tests: `tests/e2e/traceability.spec.ts`

## Notes

- 2026-11-20: created by bootstrap.
