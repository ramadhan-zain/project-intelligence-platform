# Project Intelligence Platform

A multi-tenant, event-driven platform that keeps one continuously updated source of project knowledge:
it synchronizes repositories, task sources and documentation through adapters into a canonical model,
and serves it to people (role-specific dashboard) and to AI coding agents (REST and MCP).

> The platform adapts to the repository, not the repository to the platform.

## Layout

| Path                 | What                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| `apps/web`           | Next.js dashboard                                                                                  |
| `apps/api`           | Fastify API: REST, SSE, event and webhook intake                                                   |
| `apps/worker`        | BullMQ worker: event processing, sync, reports                                                     |
| `apps/mcp`           | MCP server for AI agents                                                                           |
| `packages/contracts` | shared zod schemas, enums, constants, typed client                                                 |
| `packages/domain`    | pure business rules                                                                                |
| `packages/db`        | database access, migrations                                                                        |
| `tools/`             | `trace.py` (traceability), `github_mock`                                                           |
| `infra/`             | dev / test / prod Compose stacks, Caddy                                                            |
| `docs/`              | requirements, architecture, contracts, tasks, runbooks — start at [docs/README.md](docs/README.md) |

## Quick start

Needs Node 22, pnpm 10 (`corepack enable`), Docker, Python 3 (for `tools/trace.py`).

```sh
make install          # dependencies from the lockfile
make dev              # PostgreSQL + Redis in Docker, migrations, apps on the host (web :3000, api :3001)
make dev-up           # alternative: full stack in Docker at http://localhost:8088
make test             # unit + contract tests, coverage gate
make test-integration # integration tests against throwaway PostgreSQL / Redis
make lint             # biome, dependency rules, type check
make help             # every target
```

## Working on it

Every change starts from a task in [`docs/tasks/`](docs/tasks/README.md) (`/task-start T-nnn`, `/task-close`
in Claude Code). Requirements: [`docs/PIP-dev-spec.md`](docs/PIP-dev-spec.md). Release flow:
[`docs/RELEASE.md`](docs/RELEASE.md). Changes: [`CHANGELOG.md`](CHANGELOG.md).
