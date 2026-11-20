# Open questions

Every gap or ambiguity in the source requirements. States: `open` (nobody answered) · `assumed` (code
takes the proposed position until told otherwise) · `decided — D-nnn`.
Owners are roles: **PO** = product owner, **TL** = tech lead (both currently the repository owner).

| OQ | Subject | Source ref | Owner | Proposed position | State |
|---|---|---|---|---|---|
| OQ-001 | Sign-off of the source requirements (document status is Draft) | header | PO | PO reviews `PIP-dev-spec.md` against the source and signs off; changes after sign-off go through D-numbers | open |
| OQ-002 | Authentication method ("organization-aware authentication") | §3.2 | TL | Email + password and GitHub OAuth through a maintained library (Better Auth), database sessions in PostgreSQL, httpOnly cookie; agents use API tokens (OQ-020) | assumed |
| OQ-003 | Performance, availability and scale targets (none stated) | — | PO | ≤ 50 orgs, ≤ 500 repositories, ≤ 50 000 events/day; event visible on dashboard p95 ≤ 10 s after receipt; REST reads p95 ≤ 300 ms; 99.5 % monthly availability on one host; backup RPO 24 h, RTO 4 h | assumed |
| OQ-004 | Scope of PostgreSQL Row-Level Security ("where appropriate") | §12.3 | TL | RLS on every table carrying `organization_id`; app connects as a non-owner role and sets `app.org_id` / `app.user_id` with `SET LOCAL` per transaction; migrations run as owner | assumed |
| OQ-005 | ORM and migration tool | §3.2 | TL | Drizzle ORM + drizzle-kit migrations (SQL-first, RLS policies as SQL) | assumed |
| OQ-006 | Default progress rule ("configurable, explainable") | §8.6 | PO | Default: done ÷ (all − cancelled) by task count; per-project option to weight by priority; the UI shows rule name and inputs next to each figure | assumed |
| OQ-007 | Organization and project role names and permission matrix | §5.1, §8 | PO | Org roles: owner, admin, member. Project roles: manager, developer, designer, qa, viewer; shared-org members get `client`. Matrix in `ARCHITECTURE.md` §Security | assumed |
| OQ-008 | Milestone entity (used in §8, §11, §14, not defined in §5) | §8.2, §8.5 | PO | `milestones` (project, name, description, target date, status, order); tasks and requirements reference one milestone | assumed |
| OQ-009 | Task comments, labels and dependencies storage (§7.1, not in §5) | §7.1 | TL | `task_comments`, `task_dependencies` (blocks / blocked-by), labels as `text[]` on task | assumed |
| OQ-010 | Commit and branch entities (relationships §5.2, not in §5.1) | §5.2, §6.3 | TL | `commits`, `branches`, plus link tables task↔commit and task↔PR carrying the link source (branch, message, description, adapter, manual) | assumed |
| OQ-011 | Change request entity (§7.3, not in §5) | §7.3 | PO | `change_requests`: code `CR-nnn` per project, requirement, description, reason, impact list, status, approval | assumed |
| OQ-012 | What a "design reference" is (Figma integration is future, §18) | §8.3, §16 | PO | Link record: URL (Figma or any), title, linked requirement / task, approval; no Figma API | assumed |
| OQ-013 | Bug reports and regression tracking model | §8.4 | PO | A bug is a task with `type = bug`; regression = repeated QA results on the same requirement / task over time | assumed |
| OQ-014 | How "delivery risks" are determined | §8.2 | PO | Deterministic flags: task overdue; blocked > 3 days; milestone target passed with open tasks; approval pending > 5 days. Thresholds per project | assumed |
| OQ-015 | What "resource allocation" shows (no capacity model in source) | §8.6 | PO | Open-task count per assignee per project only; capacity planning stays future (§18) | open |
| OQ-016 | Final schema of `.project-sync.yaml` ("illustrative") | §4.3 | TL | Adopt the §4.3 shape as `version: 1`; JSON Schema generated from `packages/contracts` and published | assumed |
| OQ-017 | Schedule of hybrid consistency pulls | §4.5 | TL | Every 6 hours per repository, plus manual trigger and on integration creation | assumed |
| OQ-018 | How "released" state is detected | §6.4 | TL | GitHub `release.published`: commits reachable from the release tag are released; "merged" = reachable from the default branch | assumed |
| OQ-019 | LLM provider and model policy for summaries (R5) | §9.4, §9.5 | PO | Provider interface; Anthropic as first implementation; inexpensive model for routine summaries; off by default per organization | open |
| OQ-020 | MCP transport and authentication | §10.1 | TL | Streamable HTTP served by `apps/mcp` behind the proxy; per-user personal access tokens bound to one organization, scoped, hashed at rest, revocable | assumed |
| OQ-021 | Push-event authentication and secret encryption method | §11.2, §12.3 | TL | Integration tokens (32 random bytes, stored hashed) in `Authorization: Bearer`; GitHub webhooks verified with `X-Hub-Signature-256`; secrets encrypted with AES-256-GCM, key from `SECRETS_ENCRYPTION_KEY`, key id stored for rotation | assumed |
| OQ-022 | Delivery form of the Claude Code hooks integration | §15 Phase 3 | TL | `packages/cli` (`pip-sync`) Node CLI that posts envelopes with an integration token, plus a documented Claude Code hooks snippet calling it | assumed |
| OQ-023 | Retention of raw event payloads, audit logs, document versions | §11.2, §12.3, §13.2 | PO | Raw payloads 180 days then payload dropped (metadata kept); audit logs 2 years; document versions kept | assumed |
| OQ-024 | Production domain, TLS and reverse proxy | — | TL | Caddy with automatic TLS on one domain: web at `/`, API at `/api`, MCP at `/mcp`. Domain name still to be chosen | assumed |
| OQ-025 | Storage for uploaded files | §13.1 | TL | Docker volume, files ≤ 25 MB, metadata and checksum in PostgreSQL; S3-compatible storage later | open |
| OQ-026 | Notification channels | §14.1 | PO | In-app (stored + SSE) only for R4; email later | assumed |
| OQ-027 | GitHub remote: owner, name, visibility, plan | — | PO | Private repo under the owner's account; rulesets need GitHub Pro if private | decided — D-005 |
| OQ-028 | Sign-up and invitation flow | §5.1 | PO | Invite-only. First sign-up creates an organization; org admins invite by e-mail link | assumed |
| OQ-029 | Report schedule and time zone | §14.2 | PO | Daily 08:00, weekly Monday 08:00, in the organization's time zone (org setting, default UTC) | assumed |
| OQ-030 | Which write operations count as "sensitive" for audit | §12.3, §16 | PO | Membership / role changes; share create / change / revoke; integration create / credential rotation / delete; requirement approval and CR decisions; approvals; task writes by agents or MCP; document restore / delete; API token create / revoke | assumed |
| OQ-031 | How a requirement links to its "design specification" | §7.4 | PO | A project document of type `specification` linked to the requirement through `document_links` | assumed |
| OQ-032 | Test coverage target (source silent) | — | TL | 80 % lines over `packages/contracts` and the domain layer, enforced in CI | assumed |
| OQ-033 | Repository documentation layout (§17.3 tree vs bootstrap layout) | §17.3 | TL | Keep the bootstrap layout; `AGENTS.md` points to `CLAUDE.md`; mapping of each §17.3 file to its home in `docs/README.md` | assumed |
| OQ-034 | Where built-in adapters run | §4.2, §4.5 | TL | Built-in adapters (Markdown tasks, docs discovery) run in `apps/worker`, reading files through the GitHub App installation token at a given commit; custom push adapters run repository-side and post envelopes | assumed |
| OQ-035 | Where Gantt bar dates come from (source has due date only, no start date) | §5.1, D-006 | PO | Nullable `start_date` on tasks: editable on platform-native tasks, mapped by an adapter when its source has one. Bar = `start_date` → `due_date`. No start date → start derived from the first move to `in_progress` in task history. Only a due date → milestone-style marker. Neither → "Unscheduled" lane | assumed |
