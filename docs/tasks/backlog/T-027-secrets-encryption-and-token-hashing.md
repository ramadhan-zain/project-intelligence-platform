# T-027 — Secrets encryption and token hashing

**Phase:** 3 — Persistence · **Release:** R1 · **Status:** blocked (by T-020) · **Size:** M
**Satisfies:** NFR-7, NFR-8, AC-29 · **Depends on:** T-020 · **Gated by:** —
**Files:** `packages/db/src/crypto.ts`

## Goal

Integration secrets are encrypted with AES-256-GCM (key id stored for rotation) and integration / API tokens are stored only as hashes, scoped to one integration or one user-organization pair.

## Acceptance

- [ ] Round-trip encrypt / decrypt; tampered ciphertext rejected
- [ ] Key rotation re-encrypts with a new key id
- [ ] Tokens shown once on creation, verified by hash, scoped; no plaintext in DB or logs
- [ ] Tests: `tests/unit/db/crypto.test.ts`, `tests/integration/db/tokens.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
