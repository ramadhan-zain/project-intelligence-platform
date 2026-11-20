# T-031 — Organizations and members api

**Phase:** 4 — Services / API · **Release:** R1 · **Status:** blocked (by T-030) · **Size:** S
**Satisfies:** FR-1.1, FR-1.2 · **Depends on:** T-030 · **Gated by:** —
**Files:** `apps/api/src/routes/organizations.ts`

## Goal

Organization settings and membership (role, status) can be read and managed through the API by authorized members.

## Acceptance

- [ ] Owner / admin can change roles and deactivate members; others get 403
- [ ] Membership changes audited (T-039)
- [ ] Tests: `tests/integration/api/organizations.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
