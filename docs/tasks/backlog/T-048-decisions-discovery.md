# T-048 — Decisions discovery

**Phase:** 5 — Integrations · **Release:** R2 · **Status:** blocked (by T-047) · **Size:** S
**Satisfies:** FR-3.5 · **Depends on:** T-047 · **Gated by:** —
**Files:** `apps/worker/src/adapters/decisions/`

## Goal

ADR-style decision files in the configured folder are read into technical decision records (title, context, decision, consequences) with source references.

## Acceptance

- [ ] Standard ADR headings parsed; free-form files stored with the whole body as `decision`
- [ ] Removed file marks the decision `superseded`, never deletes it
- [ ] Tests: `tests/unit/adapters/decisions.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
