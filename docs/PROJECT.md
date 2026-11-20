# Project Intelligence Platform — Project Context

Stable context for everyone working on this repository. Requirements live in
[`PIP-dev-spec.md`](PIP-dev-spec.md); the original product specification is kept untouched in
[`source/requirements.md`](source/requirements.md).

## What it does

A multi-tenant, event-driven platform that keeps one continuously updated source of project knowledge.
It synchronizes information from Git repositories, task sources and documentation through adapters,
stores it in a canonical data model in PostgreSQL, and serves it to people (role-specific web dashboard)
and to AI coding agents (REST API and an MCP server). Deterministic synchronization comes first; LLMs are
used only where semantic interpretation is needed.

Guiding rule (source §20): **the platform adapts to the repository, not the repository to the platform.**

## Ownership and people

| Item | Value |
|---|---|
| Type | Internal product (no external client) — D-004 |
| Product owner | Repository owner (role: product owner) |
| Developers | Repository owner plus AI coding agents working through the task workflow |
| Client / vendor | None. "Client" inside the spec means a user role of the platform, see `GLOSSARY.md` |

## Scope

**In scope** — the five roadmap releases of source §15, written as tasks in `docs/tasks/`:

| Release | Content | Task detail |
|---|---|---|
| R1 — Core platform | organizations, users, projects, repositories, canonical model, tasks, documents, activity timeline, basic RBAC | detailed |
| R2 — Git-first sync | GitHub App, webhooks, commits, PRs, task association, adapter config, Markdown task adapter, documentation discovery, initial and incremental sync | detailed |
| R3 — AI integration | MCP server, context retrieval, Claude Code hooks, implementation summaries, context caching | detailed |
| R4 — Collaboration | requirements, change requests, approvals, designer / QA / client interfaces, reports, notifications | coarse (one L task per area) |
| R5 — Advanced intelligence | semantic search, AI summaries, impact analysis, QA scenario generation, cross-project reports, more providers | coarse |

**Out of scope** (source §1.4): replacing GitHub/GitLab, replacing task tools or Figma or CI/CD, forcing a
repository structure, LLM processing of every event, automatic business acceptance from code, forced
migration of existing documentation. Future considerations in source §18 are not planned.

## Deployables and stack (D-001)

| Deployable | Path | Stack |
|---|---|---|
| Web dashboard | `apps/web` | Next.js, React, Tailwind CSS, shadcn/ui |
| API | `apps/api` | Fastify (REST, SSE, webhook intake) |
| Worker | `apps/worker` | BullMQ on Redis (event processing, sync jobs) |
| MCP server | `apps/mcp` | Model Context Protocol server (TypeScript SDK) |
| Contracts | `packages/contracts` | zod schemas, enums, constants, typed client — shared by all |
| Domain rules | `packages/domain` | pure TypeScript, no I/O |
| Database access | `packages/db` | schema, migrations, repositories (tool per OQ-005) |

Language: TypeScript everywhere. Workspace: pnpm. Database: PostgreSQL (source of truth). Queue: Redis +
BullMQ. Stack recommended by source §3.2 and accepted by the product owner, not externally mandated.

## Runtime target (D-002)

Production: Docker Compose on a single host behind a reverse proxy (OQ-024). Development: the same
services via `infra/compose.yml`.

## External systems

| System | Direction | Test environment |
|---|---|---|
| GitHub (App + webhooks + REST API) | in (webhooks), out (API reads) | none yet — Phase 0 task T-003; local mock `tools/github_mock` for dev and CI |
| Claude Code and other MCP clients | in (MCP, REST, hook events) | local; no external environment needed |
| LLM provider (R5 only) | out | none — OQ-019 |

## Remote and release

| Item | Value |
|---|---|
| Remote | https://github.com/ramadhan-zain/project-intelligence-platform (public) — default branch `main` — D-005 |
| Release model | one version for the whole repo, tag `vX.Y.Z` — D-003 |
