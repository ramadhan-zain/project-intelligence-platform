# Architecture

Status: every position below is **proposed** unless it cites a D-number. Requirements: `PIP-dev-spec.md`.

## 1. Component diagram

```
                    GitHub (App, webhooks, REST)        Repo-side push adapters
                    │  webhooks              ▲ API      (CLI pip-sync, Claude Code hooks,
                    ▼                        │           GitHub Actions, custom scripts)
 ┌──────────────────────────────────────────────────────────────┐   │ POST /api/integrations/events
 │ Caddy reverse proxy (TLS)   /  → web   /api → api   /mcp → mcp │◄──┘
 └──────┬──────────────────────────┬─────────────────────┬──────┘
        │                          │                     │
 ┌──────▼──────┐  REST + SSE ┌─────▼──────────────┐ ┌────▼──────────────┐
 │ apps/web    │────────────►│ apps/api (Fastify) │ │ apps/mcp          │◄── MCP clients
 │ Next.js     │             │ REST, SSE, webhook │ │ Streamable HTTP   │    (Claude Code …)
 │ dashboards  │             │ + event intake     │ │ tools → services  │
 └─────────────┘             └──┬──────────┬──────┘ └──┬────────────────┘
                                │enqueue   │read/write │read/write
                         ┌──────▼───┐  ┌───▼───────────▼─────────────┐
                         │ Redis    │  │ PostgreSQL (source of truth)│
                         │ BullMQ   │  │ RLS per organization        │
                         └──────┬───┘  │ + LISTEN/NOTIFY for SSE     │
                                │      └───▲─────────────────────────┘
                         ┌──────▼──────────┴──┐
                         │ apps/worker        │──► GitHub API (pull sync, built-in adapters)
                         │ event processing,  │──► LLM provider (R5 only, optional)
                         │ sync jobs, reports │
                         └────────────────────┘
 Shared by all TypeScript apps: packages/contracts (schemas, enums, constants, typed client)
                                packages/db (schema, migrations, tenant-scoped repositories)
                                packages/domain (pure rules: status mapping, authority, progress)
```

| Component | Deployable / service | Image |
|---|---|---|
| Web dashboard | `apps/web` | `pip-web` |
| API | `apps/api` | `pip-api` |
| Worker | `apps/worker` | `pip-worker` |
| MCP server | `apps/mcp` | `pip-mcp` |
| Reverse proxy | Caddy (OQ-024) | `caddy` (upstream) |
| Database | PostgreSQL 17 | `postgres` (upstream) |
| Queue | Redis 7 + BullMQ | `redis` (upstream) |
| Push CLI | `packages/cli` (`pip-sync`, OQ-022) | npm package / binary, not a service |
| GitHub mock | `tools/github_mock` | dev and CI only |

## 2. Components

**apps/web (Next.js).** Role-specific dashboards (developer, PM, designer, QA, client portal, management).
Talks only to the API through the typed client from `packages/contracts`; it holds no database
credentials. Server components fetch with the user's session cookie; realtime through one SSE connection
per tab.

**apps/api (Fastify).** All REST endpoints, authentication (OQ-002), API tokens, the generic event intake
`POST /api/integrations/events`, GitHub webhook intake `POST /api/webhooks/github`, and the SSE stream.
Intake does only cheap synchronous work — authenticate, verify signature, validate the envelope, insert
the raw event (deduplicated by unique key), enqueue — then answers `202`. `GET /health` reports each
dependency and the release version.

**apps/worker (BullMQ).** Consumes queues: `events` (normalize, apply authority rules, update records,
record sync result, notify), `sync` (initial, incremental, full and scheduled consistency runs of built-in
adapters, OQ-034), `reports`, `notifications`, and later `summaries` (R5). Every job carries
`organization_id` and runs its database work inside the same tenant scope as a request (NFR-10).
Retries with exponential backoff; exhausted jobs land in the `dead_letter_events` table (FR-9.12).

**apps/mcp.** MCP server over Streamable HTTP (OQ-020). Each tool maps to the same service functions the
REST API uses, so authorization and source-ownership checks are shared code, not copies (NFR-10).

**packages/contracts.** zod schemas for the event envelope, every event payload, canonical task /
document schemas, REST request / response bodies, MCP tool inputs / outputs, `.project-sync.yaml`; enums
(canonical statuses, document categories, event types); route and queue name constants; a typed REST
client. JSON Schema snapshots in `packages/contracts/snapshots/` are checked by the contract tests.

**packages/domain.** Pure functions, no I/O: status mapping, task-id extraction from branch / commit / PR
text, authority and conflict resolution (BR-004, BR-005), progress rules (OQ-006), risk flags (OQ-014),
branch-state derivation (FR-4.9), permission evaluation (OQ-007). Highest test coverage (NFR-15).

**packages/db.** Drizzle schema and migrations (OQ-005), RLS policies, and repository functions that take
a tenant context and run in a transaction that sets `app.org_id` / `app.user_id` (OQ-004).

## 3. Data stores

* **PostgreSQL** — every canonical entity, raw events, sync results, dead letters, audit log, document
  versions, cached context and summaries with their input versions, sessions and tokens. History is kept
  by append-only `*_versions` tables written in the same transaction as the update (FR-5.5, FR-11.4,
  BR-005). Unique key `(source, external_event_id)` on `project_events` gives deduplication (FR-9.6).
* **Redis** — BullMQ queues only (NFR-2). Losing Redis loses queued jobs, not data: raw events are
  already stored, and a recovery job re-enqueues events with no sync result (FR-3.20).

Tenant isolation (NFR-6, OQ-004): every tenant table carries `organization_id`; RLS policies compare it
with `current_setting('app.org_id')`; shared projects are reachable through a `project_shares` policy
branch, never by widening the org setting (BR-015).

## 4. Event flow

1. Source sends an event (webhook or envelope).
2. API: authenticate → verify signature → validate envelope (contracts) → `INSERT … ON CONFLICT DO
   NOTHING` into `project_events` → enqueue `events` job → `202`.
3. Worker: load event → normalize (adapter-specific mapper) → resolve authority per field (domain) →
   write records + version rows in one transaction → write `sync_results` → `NOTIFY project_changes`.
4. API SSE hub listens on `project_changes`, filters each change against the subscriber's permissions,
   pushes it (FR-9.14).
5. Failure: BullMQ retry with backoff (FR-9.11); after the last attempt, row in `dead_letter_events`;
   operators replay from the dashboard or CLI.

No step calls an LLM (NFR-3). Summaries (R5) are separate jobs triggered by cache invalidation and are
written to `generated_summaries`, never to authoritative tables (BR-003).

## 5. Failure isolation

| Failure | Effect | Recovery |
|---|---|---|
| Worker down | events accumulate in Redis / as unprocessed rows; dashboards stay readable | restart; backlog drains |
| Redis down | intake still stores raw events, enqueue fails → event marked `pending_enqueue` | recovery job re-enqueues on Redis return |
| GitHub unreachable | pull sync jobs retry; webhooks resent by GitHub (redelivery) | scheduled consistency pull (OQ-017) |
| PostgreSQL down | API `/health` fails, intake answers `503` so senders retry | restore / restart; see `OPERATIONS.md` |
| MCP down | agents lose context; REST and web unaffected | restart |
| LLM provider down (R5) | summaries marked `failed`; no effect on sync | retry later |

## 6. Security (proposed matrix, OQ-007)

| Action | owner/admin | manager | developer | designer | qa | viewer | client (shared) |
|---|---|---|---|---|---|---|---|
| Manage org, members, integrations | ✓ | — | — | — | — | — | — |
| Manage project, members, shares | ✓ | ✓ | — | — | — | — | — |
| Read tasks, activity, internal docs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | per share |
| Write tasks, comments | ✓ | ✓ | ✓ | ✓ | ✓ | — | comment if shared |
| Requirements, CRs: create | ✓ | ✓ | — | — | — | — | CR if shared |
| Approvals | ✓ | ✓ | — | design only | — | — | if shared |
| QA results | ✓ | ✓ | — | — | ✓ | — | — |

Secrets: AES-256-GCM, key from environment (OQ-021). Webhooks: signature checked before parsing (NFR-9).
Tokens: stored as hashes, scoped, revocable; permission checks read current grants on every request, no
long-lived cached grants (NFR-17).

## 7. Decisions and positions

| Topic | Position | Ref |
|---|---|---|
| Stack and deployables | as §1 | D-001 |
| Runtime | Compose on one host | D-002 |
| Versioning | one version | D-003 |
| Auth | Better Auth, DB sessions | OQ-002 (assumed) |
| ORM | Drizzle | OQ-005 (assumed) |
| RLS | every tenant table | OQ-004 (assumed) |
| MCP transport | Streamable HTTP | OQ-020 (assumed) |
| SSE fan-out | PostgreSQL LISTEN/NOTIFY into API | proposed |
| Built-in adapters | run in worker | OQ-034 (assumed) |
