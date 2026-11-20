# T-035 — Document api versions restore

**Phase:** 4 — Services / API · **Release:** R1 · **Status:** blocked (by T-023) · **Size:** M
**Satisfies:** FR-11.1, FR-11.2, FR-11.4, FR-11.5 · **Depends on:** T-023 · **Gated by:** —
**Files:** `apps/api/src/routes/documents.ts`

## Goal

Native Markdown documents can be created and edited; every document (native or synced) exposes its versions, a diff between two versions and restore for native documents.

## Acceptance

- [ ] Restore creates a new version (history never rewritten)
- [ ] Restore of a repository-sourced document refused (source owns it)
- [ ] Visibility enforced on read
- [ ] Tests: `tests/integration/api/documents.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
