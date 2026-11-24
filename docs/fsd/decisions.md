# Decisions

A decision is binding; changing one is a contract change. Cite D-numbers from code comments, tasks and
commits. Long-form architecture decisions go to `adr/ADR-nnn-<slug>.md`.

| # | Decision | OQ | State |
|---|---|---|---|
| D-001 | Deployables and stack: pnpm TypeScript monorepo with web, api, worker, mcp, contracts | — | binding |
| D-002 | Production runtime: Docker Compose on a single host | — | binding |
| D-003 | One version for the whole repository, tag `vX.Y.Z` | — | binding |
| D-004 | Internal product, no external client | — | binding |
| D-005 | Remote: public GitHub repository `ramadhan-zain/project-intelligence-platform`, default branch `main` | OQ-027 | binding |
| D-006 | Task views: Kanban view on the task board and a Gantt view of the project schedule | OQ-035 | binding |

## D-001 — Deployables and stack

* **Question:** Which deployables and stack? Source §3.2 recommends Next.js, Fastify, PostgreSQL, Redis + BullMQ, SSE, MCP, Docker.
* **Answer:** Accept the recommendation. One pnpm workspace in TypeScript: `apps/web` (Next.js), `apps/api`
  (Fastify: REST, SSE, webhook intake), `apps/worker` (BullMQ), `apps/mcp` (MCP server),
  `packages/contracts` (shared zod schemas, enums, constants, typed client), `packages/db` (schema, migrations).
* **Agreed by:** product owner (bootstrap interview).
* **Date:** 2026-11-20.

## D-002 — Production runtime

* **Question:** Where does production run?
* **Answer:** Docker Compose on one host. Dev compose and prod stack run the same services and images.
* **Agreed by:** product owner (bootstrap interview).
* **Date:** 2026-11-20.

## D-003 — Release model

* **Question:** One version or per package?
* **Answer:** One version for the whole repository, git tag `vX.Y.Z`. Adapter versions (FR-3.18) are a
  field of the adapter contract, not separate package releases.
* **Agreed by:** product owner (bootstrap interview).
* **Date:** 2026-11-20.

## D-004 — Ownership

* **Question:** Who is the product for?
* **Answer:** Internal product of the repository owner's organization. "Client" in the spec is a user role.
* **Agreed by:** product owner (bootstrap interview).
* **Date:** 2026-11-20.

## D-005 — Git remote

* **Question:** Where does the code live (OQ-027)?
* **Answer:** `https://github.com/ramadhan-zain/project-intelligence-platform`, public, personal account,
  default branch `main` (created on first push). Public visibility means rulesets work on the free plan.
* **Agreed by:** product owner (created the repository).
* **Date:** 2026-11-20.

## D-006 — Task views: Kanban and Gantt

* **Question:** Which views does the task UI offer? The source (§7.1, §8.2) lists task features and
  milestones but names no layout.
* **Answer:** Two views besides the task list.
  * **Kanban view** on the task board (T-073): one column per canonical status. Dragging a card changes
    its status only where the platform is the authoritative source (BR-002, BR-004). Cards for
    source-owned tasks are locked and show the reason, same as every other source-owned field.
  * **Gantt view** (T-078): tasks as bars from start to due date, grouped by milestone, with milestone
    markers and dependency links. Where bar dates come from: OQ-035.
* **Agreed by:** product owner (session after bootstrap; reference was a task-progress dashboard
  of another project, see T-077 notes).
* **Date:** 2026-11-20.

## D-007 — Database migrations are forward-only

* **Question:** OQ-036. drizzle-kit (OQ-005) generates no down migrations; RELEASE.md asks each migration
  to be reversible or listed as "restore from backup to roll back".
* **Answer:** Migrations are forward-only. Rolling back a release that carries migrations means restoring
  the pre-deploy backup (RELEASE.md §3); every such release says so under **Deployment**. Destructive
  schema changes are split expand → migrate → contract across releases, so the previous release still
  runs on the new schema.
* **Agreed by:** tech lead (T-020 session).
* **Date:** 2026-11-21.
