# T-006 — Two sample repositories fixture

**Phase:** 0 — Unblock · **Release:** R2 · **Status:** ready · **Size:** S
**Satisfies:** tooling · **Depends on:** — · **Gated by:** —
**Files:** `tests/fixtures/repos/repo-a/`, `tests/fixtures/repos/repo-b/`

## Goal

Two fixture repositories with different structures (source §4.1 A and B) exist in the test tree, so adapter and end-to-end tests can prove AC-1 and AC-2.

## Acceptance

- [ ] `repo-a`: `CLAUDE.md`, `BACKLOG.md` (`TASK-n` headings), `docs/architecture.md`, `docs/requirements.md`, `.project-sync.yaml`
- [ ] `repo-b`: `AGENTS.md`, `TASKS.md` (different status words), `documentation/system-design.md`, no config file
- [ ] README in `tests/fixtures/repos/` lists what each fixture is meant to prove
- [ ] Tests: used by T-046, T-047, T-102

## Notes

- 2026-11-20: created by bootstrap.
