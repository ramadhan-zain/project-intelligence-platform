# T-047 — Documentation discovery

**Phase:** 5 — Integrations · **Release:** R2 · **Status:** blocked (by T-011, T-006) · **Size:** M
**Satisfies:** FR-3.14, FR-3.11, AC-4 · **Depends on:** T-011, T-006 · **Gated by:** —
**Files:** `apps/worker/src/adapters/docs-discovery/`

## Goal

Documents are discovered from configured paths and, without a config, from the conventions in `adapter-contract.md`, then stored as canonical documents with category, commit and path.

## Acceptance

- [ ] `repo-a` (configured) and `repo-b` (conventions only) both yield architecture and agent-instruction docs
- [ ] Unknown doc types stored as `custom`
- [ ] Unchanged files (same blob sha) not re-versioned
- [ ] Tests: `tests/unit/adapters/docs-discovery.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
