# User acceptance tests

One section per acceptance criterion of `PIP-dev-spec.md` §8. Run on the target host before acceptance
(and for changed ACs before each release, `RELEASE.md` §1). Seed data: `make uat-seed` (T-106).
Fill **Result** with date, version, tester role, pass / fail and notes.

## AC-1 — Two repositories with different directory structures can connect to the same project

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Two repositories with different directory structures can connect to the same project.
* **Result:** not run

## AC-2 — Repositories can use different task management conventions

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Repositories can use different task management conventions.
* **Result:** not run

## AC-3 — Repository adapters can map external statuses to canonical statuses

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Repository adapters can map external statuses to canonical statuses.
* **Result:** not run

## AC-4 — Documentation can be discovered without forcing repository restructuring

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Documentation can be discovered without forcing repository restructuring.
* **Result:** not run

## AC-5 — Git events update platform records automatically

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Git events update platform records automatically.
* **Result:** not run

## AC-6 — Duplicate events do not create duplicate tasks or activity

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Duplicate events do not create duplicate tasks or activity.
* **Result:** not run

## AC-7 — Repository synchronization can recover after temporary failures

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Repository synchronization can recover after temporary failures.
* **Result:** not run

## AC-8 — Platform records preserve original source references

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Platform records preserve original source references.
* **Result:** not run

## AC-9 — PMs can see task status across connected repositories

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** PMs can see task status across connected repositories.
* **Result:** not run

## AC-10 — PMs can identify blocked tasks

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** PMs can identify blocked tasks.
* **Result:** not run

## AC-11 — Requirement changes preserve their history

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Requirement changes preserve their history.
* **Result:** not run

## AC-12 — Requirements can be linked to implementation tasks

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Requirements can be linked to implementation tasks.
* **Result:** not run

## AC-13 — Project progress is calculated using transparent rules

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Project progress is calculated using transparent rules.
* **Result:** not run

## AC-14 — Claude Code can retrieve project context through MCP

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Claude Code can retrieve project context through MCP.
* **Result:** not run

## AC-15 — AI agents can retrieve repository-specific context

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** AI agents can retrieve repository-specific context.
* **Result:** not run

## AC-16 — AI agents can publish structured progress updates

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** AI agents can publish structured progress updates.
* **Result:** not run

## AC-17 — AI-generated summaries are distinguishable from authoritative data

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** AI-generated summaries are distinguishable from authoritative data.
* **Result:** not run

## AC-18 — Ordinary Git and task updates do not require LLM calls

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Ordinary Git and task updates do not require LLM calls.
* **Result:** not run

## AC-19 — Context retrieval respects user and organization permissions

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Context retrieval respects user and organization permissions.
* **Result:** not run

## AC-20 — PMs can access a project dashboard without Git access

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** PMs can access a project dashboard without Git access.
* **Result:** not run

## AC-21 — Designers can publish and review design references

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Designers can publish and review design references.
* **Result:** not run

## AC-22 — QA can access acceptance criteria and record test results

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** QA can access acceptance criteria and record test results.
* **Result:** not run

## AC-23 — Clients can view explicitly shared project information

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Clients can view explicitly shared project information.
* **Result:** not run

## AC-24 — Clients can submit approvals and change requests

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Clients can submit approvals and change requests.
* **Result:** not run

## AC-25 — Management can view authorized cross-project reports

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Management can view authorized cross-project reports.
* **Result:** not run

## AC-26 — Organization isolation is enforced

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Organization isolation is enforced.
* **Result:** not run

## AC-27 — Cross-organization sharing requires explicit authorization

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Cross-organization sharing requires explicit authorization.
* **Result:** not run

## AC-28 — Revoked permissions take effect across API and MCP

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Revoked permissions take effect across API and MCP.
* **Result:** not run

## AC-29 — Integration secrets are protected

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** Integration secrets are protected.
* **Result:** not run

## AC-30 — All sensitive write operations are auditable

* **Setup:** to be written by the task that delivers it (see `docs/fsd/traceability.md`).
* **Steps:** —
* **Expected:** All sensitive write operations are auditable.
* **Result:** not run
