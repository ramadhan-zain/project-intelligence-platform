# T-088 — Management view risks allocation

**Phase:** 8 — UI · **Release:** R4 · **Status:** gated (by OQ-015) · **Size:** L
**Satisfies:** FR-6.6, FR-6.2 · **Depends on:** T-077, T-018 · **Gated by:** OQ-015
**Files:** `apps/web/src/app/(org)/management/`

## Goal

Management sees organization-wide project health, delayed milestones, resource allocation, pending client approvals and scope changes; the PM view gains approvals, requirement changes and delivery risks.

## Acceptance

- [ ] Risk flags explained (which rule fired, on which items)
- [ ] Resource allocation shows what OQ-015 decides, nothing more
- [ ] Tests: `tests/e2e/management.spec.ts`

## Notes

- 2026-11-20: created by bootstrap.
