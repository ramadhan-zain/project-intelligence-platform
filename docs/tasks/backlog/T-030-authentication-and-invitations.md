# T-030 — Authentication and invitations

**Phase:** 4 — Services / API · **Release:** R1 · **Status:** blocked (by T-021) · **Size:** M
**Satisfies:** FR-1.2 · **Depends on:** T-021 · **Gated by:** —
**Files:** `apps/api/src/auth/`

## Goal

Users sign up and sign in (email + password, GitHub OAuth) with database sessions; the first sign-up creates an organization; admins invite members by e-mail link (OQ-002, OQ-028).

## Acceptance

- [ ] Sign-up creates user + organization + owner membership in one transaction
- [ ] Invitation link joins the invited organization only; expired / reused links refused
- [ ] Session cookie httpOnly, secure in production; sign-out invalidates the session row
- [ ] Tests: `tests/integration/api/auth.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
