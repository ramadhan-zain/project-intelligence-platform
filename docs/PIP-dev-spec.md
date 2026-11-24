# PIP — Developer Requirements Specification

**Source:** [`source/requirements.md`](source/requirements.md) — "Project Intelligence Platform, Product
Requirements & Technical Development Specification", status Draft; signed off against this spec on
2026-11-24 (D-008). Requirement changes from then on go through D-numbers.
**Version:** 1.2 (2026-11-24). 1.0 restructured the source with no requirement added or removed; 1.1
adds FR-5.12 and FR-5.13 (D-006); 1.2 cites the sign-off gaps OQ-037–OQ-040 (D-008).

Conventions:

* IDs: `FR-a.n` functional (area `a`), `BR-nnn` business rule, `NFR-n` non-functional, `AC-n` acceptance.
  Each ID is defined once, in bold, here. Elsewhere it is cited plain.
* `(Source: §x.y)` points at the section of the source document.
* Where the source is ambiguous or silent, the requirement cites an `OQ-nnn` from
  [`fsd/open-questions.md`](fsd/open-questions.md). The spec never resolves an ambiguity on its own.
* "Task" in this document means a **platform task** (a work item tracked by the product), not a
  bootstrap task `T-nnn` in `docs/tasks/`. See [`GLOSSARY.md`](GLOSSARY.md).

---

## 1. Scope

### 1.1 In scope

The five roadmap releases of source §15 (R1 core platform, R2 Git-first synchronization, R3 AI
integration, R4 cross-functional collaboration, R5 advanced intelligence). Initial production
deployment is accepted against §8 of this document (source §16).

### 1.2 Out of scope (Source: §1.4, §18)

* Replacing GitHub, GitLab or other Git providers; replacing task management platforms, Figma or CI/CD.
* Forcing one repository directory structure or migration of existing documentation.
* LLM processing of every repository event.
* Automatically determining business acceptance from code changes.
* Future considerations of source §18 other than the providers in FR-4.10 and FR-13.1 (OQ-040): Figma
  API, Google Workspace, Slack/Teams, automated risk detection, resource planning, adapter marketplace, ….

---

## 2. Users and roles (Source: §1.1, §8)

| Role | Kind | Uses | Sees |
|---|---|---|---|
| Developer | internal | web, MCP, REST | tasks, technical context, PRs, decisions |
| Project manager (PM) | internal | web | progress, blocked tasks, approvals, risks |
| Designer | internal | web | design requirements, design references, approvals |
| QA engineer | internal | web | tasks ready for test, acceptance criteria, results |
| Management | internal | web | organization-wide, cross-project reports |
| Client | external org (shared) | web (client portal) | only explicitly shared project information |
| AI agent | machine | MCP, REST | context allowed by the token's user and organization |
| Integration / adapter | machine | event intake, pull sync | its own project's events |

Exact role names, organization roles and the permission matrix: OQ-007.

---

## 3. Functional requirements

### FR-1 Tenancy, users, projects and repositories

**FR-1.1** Organizations can be created and managed with id, name, slug, settings and creation time. *(Source: §5.1 Organization, §15 Phase 1)*

**FR-1.2** Users can be managed and added to organizations as members with a role and a membership status. Sign-up and invitation flow: OQ-028; authentication method: OQ-002. *(Source: §5.1 Organization Member, §15 Phase 1)*

**FR-1.3** Projects can be created inside an organization with name, description, status, visibility, project manager, start date and target date. *(Source: §5.1 Project, §15 Phase 1)*

**FR-1.4** Users can be added to projects as project members with a role and permissions. *(Source: §5.1 Project Member)*

**FR-1.5** Basic role-based access control applies to organization and project actions. *(Source: §15 Phase 1, §8)*

**FR-1.6** Repositories can be registered to a project with provider, external repository id, URL, default branch, integration status and last synchronization time. *(Source: §5.1 Repository, §15 Phase 1)*

**FR-1.7** Several repositories with different directory structures and task conventions can be connected to the same project. *(Source: §4.1, §16)*

**FR-1.8** Each project has an activity timeline of its events in time order. *(Source: §15 Phase 1)*

### FR-2 Canonical data model and provenance

**FR-2.1** The platform keeps one canonical internal data model; external sources translate their own structures into it. *(Source: §2.1, §20)*

**FR-2.2** Task records hold project, external id, title, description, status, priority, assignee, due date, source reference, creation and update time. *(Source: §5.1 Task)*

**FR-2.3** Requirement records hold project, requirement code, title, description, status, version, priority, acceptance criteria and approval status. *(Source: §5.1 Requirement)*

**FR-2.4** Project document records hold project, repository, title, document type, content, source reference, version, visibility and update time. *(Source: §5.1 Project Document)*

**FR-2.5** Technical decision records hold project, title, context, decision, consequences, source reference, author and creation time. *(Source: §5.1 Technical Decision)*

**FR-2.6** Project event records hold organization, project, repository, event type, source, external event id, payload and creation time. *(Source: §5.1 Project Event)*

**FR-2.7** Pull request records hold repository, external id, branch, target branch, title, status, author, merge time and external URL. *(Source: §5.1 Pull Request)*

**FR-2.8** QA result records hold project, task, requirement, test status, result, tester and test time. *(Source: §5.1 QA Result)*

**FR-2.9** Approval records hold project, entity type, entity id, approval type, status, approver, approval time and comments. Approval workflow: OQ-037. *(Source: §5.1 Approval, §15 Phase 4)*

**FR-2.10** Repository integration records hold repository, adapter type, adapter version, configuration, synchronization mode and status. *(Source: §5.1 Repository Integration)*

**FR-2.11** Entities the source uses but does not define get records too: milestones (OQ-008), task comments and dependencies (OQ-009), commits and branches (OQ-010), change requests (OQ-011), design references (OQ-012), releases (OQ-039). *(Source: §7.1, §7.3, §8.2, §8.3, §5.2, §3.1)*

**FR-2.12** The model supports relationships between organizations–projects, projects–repositories, projects–requirements, requirements–tasks, tasks–pull requests, tasks–commits, tasks–QA results, requirements–approvals, documents–source repositories and technical decisions–implementation changes. *(Source: §5.2)*

**FR-2.13** No repository has to provide every entity type; relationships are optional per source. *(Source: §5.2)*

**FR-2.14** Every synchronized record keeps its source reference and provenance (source type, location, external id, version or commit). *(Source: §2.3, §16)*

### FR-3 Repository adapters and synchronization

**FR-3.1** Each repository can register an adapter that describes how to discover repository information, where tasks live, how task statuses are interpreted, where requirements live, how documentation is discovered, how implementation activity is reported, which events are synchronized, and how canonical entities map back to repository entities. *(Source: §4.2)*

**FR-3.2** An adapter can be a repository configuration file, a custom script, a GitHub Action, a CLI integration, a platform-provided plugin or an external service; no implementation language is required. *(Source: §4.2)*

**FR-3.3** The platform accepts a repository configuration file `.project-sync.yaml` (shape of source §4.3) and validates it. Final schema: OQ-016. *(Source: §4.3, §17.2)*

**FR-3.4** Adapters that do not use `.project-sync.yaml` are supported. *(Source: §4.3)*

**FR-3.5** The adapter contract is logical — discover, getTasks, getDocuments, getRequirements, getDecisions, normalize, publishEvent, resolveReference, healthCheck — and an adapter implements only the operations its mode needs. *(Source: §4.4)*

**FR-3.6** Push mode: the repository side sends events (webhooks, Claude Code hooks, GitHub Actions, CLI scripts). *(Source: §4.5 Mode A)*

**FR-3.7** Pull mode: the platform periodically fetches repository information (task files, documentation, issue status, new documents). *(Source: §4.5 Mode B)*

**FR-3.8** Hybrid mode — push for increments plus scheduled pulls for consistency — is supported and is the default. Schedule: OQ-017. *(Source: §4.5 Mode C)*

**FR-3.9** Adapters deliver tasks in the canonical task schema: external id, title, description, status, priority, assignee, labels, source (type, path, reference), relationships (requirement ids, parent task) and update time. *(Source: §4.6)*

**FR-3.10** Canonical task statuses are `backlog`, `todo`, `in_progress`, `in_review`, `blocked`, `done`, `cancelled`; external statuses map to them through adapter configuration and the original value is kept as source metadata. *(Source: §4.6)*

**FR-3.11** Adapters deliver documents in the canonical document schema: external id, title, type, format, content, source (repository, path, branch, commit), visibility, version and update time. *(Source: §4.7)*

**FR-3.12** Document categories are `overview`, `architecture`, `requirements`, `specification`, `agent_instructions`, `technical_decision`, `development_notes`, `deployment`, `testing`, `release_notes`, `custom`; unknown categories are stored as `custom` with metadata. *(Source: §4.7)*

**FR-3.13** A platform-provided Markdown task adapter reads tasks from a Markdown file using a configured id pattern, title and description mapping and status mapping. *(Source: §15 Phase 2, §4.3)*

**FR-3.14** Documentation is discovered from configured paths and conventional locations without restructuring the repository. *(Source: §15 Phase 2, §16)*

**FR-3.15** A newly connected repository gets an initial synchronization of its tasks, documents, decisions and recent activity. *(Source: §15 Phase 2)*

**FR-3.16** After the initial run, synchronization is incremental (only changed sources are re-read). *(Source: §15 Phase 2, §17.2)*

**FR-3.17** A full resynchronization of one repository can be triggered. *(Source: §17.2)*

**FR-3.18** Adapters are versioned independently of the platform, and each integration records the adapter version it runs. *(Source: §17.2)*

**FR-3.19** Each integration has a health check and synchronization diagnostics (last run, result, errors) visible to project admins. *(Source: §4.4 healthCheck, §17.2)*

**FR-3.20** Synchronization retries and recovers after temporary failures without losing or duplicating data. *(Source: §17.2, §16)*

**FR-3.21** Canonical schema changes are delivered as explicit schema migrations with adapter compatibility rules; repositories do not have to restructure local files. *(Source: §17.2)*

### FR-4 Git integration

**FR-4.1** GitHub is integrated through a GitHub App installed per organization or repository. *(Source: §3.2, §15 Phase 2)*

**FR-4.2** GitHub webhooks are received for connected repositories. *(Source: §15 Phase 2)*

**FR-4.3** Supported Git events: repository connected, branch created, push received, commit created, pull request opened, updated, approved, changes requested, merged, closed, and release published. *(Source: §6.1)*

**FR-4.4** Commits are synchronized (sha, message, author, time, changed files, branch). *(Source: §15 Phase 2, §6.3)*

**FR-4.5** Pull requests are synchronized with their status transitions. *(Source: §15 Phase 2)*

**FR-4.6** Tasks are associated with Git activity through task ids in branch names, commit messages and pull request descriptions, and through explicit links from the adapter. *(Source: §6.2)*

**FR-4.7** Users can associate Git activity with a task manually in the dashboard. *(Source: §6.2 item 5)*

**FR-4.8** Development activity records commit count, changed files, associated tasks, pull request status, branch status, merge date, author and source references. *(Source: §6.3)*

**FR-4.9** The platform keeps separate states per capability: canonical project state, active branch state, merged state and released state. Release detection: OQ-018. *(Source: §6.4)*

**FR-4.10** Additional Git providers (GitLab, then Bitbucket) are integrated behind the same adapter boundary. Release placement: OQ-040. *(Source: §15 Phase 5, §18)*

### FR-5 Tasks, requirements and change requests

**FR-5.1** The platform offers a native task interface while external task sources stay authoritative for the tasks they own. *(Source: §7.1)*

**FR-5.2** Platform-native tasks support creation, assignment, status updates, priority, labels and due dates. *(Source: §7.1)*

**FR-5.3** Tasks support comments. *(Source: §7.1)*

**FR-5.4** Tasks support dependencies on other tasks. *(Source: §7.1)*

**FR-5.5** Every task keeps its change history. *(Source: §7.1)*

**FR-5.6** Requirements have explicit identifiers (e.g. `REQ-012`) and version history. *(Source: §7.2)*

**FR-5.7** Requirements carry acceptance criteria and an approval status. *(Source: §7.2, §5.1)*

**FR-5.8** Change requests record the related requirement, description, reason, impact and approval state. *(Source: §7.3)*

**FR-5.9** Approving a change request creates a new requirement version and keeps the originally approved version. *(Source: §7.3)*

**FR-5.10** The platform shows the traceability chain requirement → design specification → task → branch / pull request → merged implementation → QA result → client acceptance. Design specification link: OQ-031. *(Source: §7.4)*

**FR-5.11** Requirements can be linked to implementation tasks. *(Source: §7.4, §16)*

**FR-5.12** The task board offers a list view and a Kanban view with one column per canonical status; moving a card changes the task's status only where the platform is the authoritative source. *(Source: D-006)*

**FR-5.13** A Gantt view shows tasks as bars from start to due date, grouped by milestone, with milestone markers and dependency links. Bar dates: OQ-035. *(Source: D-006)*

### FR-6 Role-based interfaces

**FR-6.1** Developer view: assigned tasks, project technical context, architecture documents, active development activity, related requirements, pull request status, technical decisions, AI context retrieval. *(Source: §8.1)*

**FR-6.2** Project manager view: project progress, task distribution, milestones, blocked tasks, outstanding approvals, requirement changes, delivery risks (OQ-014) and progress reporting. *(Source: §8.2)*

**FR-6.3** Designer view: design-related requirements, design references (OQ-012), design approval status, implementation progress, design feedback, outstanding design dependencies. *(Source: §8.3)*

**FR-6.4** QA view: tasks ready for testing, associated requirements, acceptance criteria, pull request references, test scenarios, bug reports (OQ-013), test results, regression tracking. *(Source: §8.4)*

**FR-6.5** Client portal: project overview, milestones, completed deliverables, upcoming work, pending approvals, change requests, release notes, shared project documents. *(Source: §8.5)*

**FR-6.6** Management view: organization-wide project overview, project health, delayed milestones, resource allocation (OQ-015), pending client approvals, scope changes, project reporting. *(Source: §8.6)*

**FR-6.7** Project progress is computed by configurable rules, and the dashboard shows which rule and inputs produced a figure. Default rule: OQ-006. *(Source: §8.6, §16)*

### FR-7 AI context engine

**FR-7.1** A context engine returns the minimum relevant information an agent needs, independent of any LLM provider. *(Source: §9.1)*

**FR-7.2** Context categories: project overview, repository overview, architecture, coding conventions, active tasks, recent activity, technical decisions, requirements, known issues, deployment instructions. *(Source: §9.2)*

**FR-7.3** Retrieval operations: project overview, repository context, project tasks by status, recent activity with limit, related requirements of a task (OQ-038), technical decisions by query. *(Source: §9.3)*

**FR-7.4** Retrieval filters by organization, project, repository, task, requirement, document category, date range and the caller's permissions. *(Source: §9.3)*

**FR-7.5** LLMs are used only where semantic understanding is needed: project summaries, architectural change explanations, inconsistency hints, activity summaries, weekly reports, requirement impact hints. Provider: OQ-019. *(Source: §9.4)*

**FR-7.6** Generated summaries are cached and invalidated when any input record changes. *(Source: §9.4)*

**FR-7.7** Each generated summary records model and provider, generation time, input record versions, source references and generation status. *(Source: §9.5)*

**FR-7.8** Context responses are cached and invalidated by the events that change their inputs. *(Source: §15 Phase 3)*

**FR-7.9** Semantic search over project content, introduced only once structured retrieval is shown to be insufficient (BR-018). *(Source: §15 Phase 5, §17.1)*

**FR-7.10** Change impact analysis: given a requirement change, list affected tasks, documents, tests and deliverables. *(Source: §15 Phase 5, §9.4)*

**FR-7.11** Automated QA scenario generation from requirements and acceptance criteria, stored as agent-generated drafts. *(Source: §15 Phase 5)*

### FR-8 MCP, REST and agent integration

**FR-8.1** An MCP server offers read tools `get_project_overview`, `get_repository_context`, `get_project_tasks`, `get_recent_activity`, `get_project_requirements`, `get_technical_decisions`, `get_document`, `get_related_entities`. Transport and auth: OQ-020. *(Source: §10.1)*

**FR-8.2** The MCP server offers write tools `update_task_status`, `add_project_note`, `publish_progress`, `create_change_request`, `submit_implementation_summary`. *(Source: §10.1)*

**FR-8.3** Every write through MCP or REST checks the caller's authorization and the target field's source ownership. *(Source: §10.1)*

**FR-8.4** A REST API offers equivalents of the MCP operations, including at least `GET /api/projects/:projectId`, `…/tasks`, `…/documents`, `…/activity`, `POST /api/integrations/events`, `POST /api/projects/:projectId/change-requests`, `PATCH /api/tasks/:taskId`, `POST /api/tasks/:taskId/comments`. *(Source: §10.2)*

**FR-8.5** Coding agents can retrieve project context, retrieve assigned tasks, publish implementation progress, associate work with tasks, publish technical decisions, report completion and retrieve documentation. *(Source: §10.3)*

**FR-8.6** A Claude Code hooks integration publishes agent activity to the platform from a repository. Delivery form: OQ-022. *(Source: §15 Phase 3, §4.5)*

**FR-8.7** Agents can publish implementation summaries linked to tasks. *(Source: §15 Phase 3, §10.1)*

### FR-9 Event ingestion, processing and realtime

**FR-9.1** Changes reach the platform as events (push, PR created / merged, task status change, document change, requirement approval, QA result, client approval), not through continuous polling or repeated LLM analysis. *(Source: §2.2)*

**FR-9.2** Every integration publishes events in a standard envelope: event id, event type, schema version, organization, project, repository, source (type, name), entity (type, external id), occurrence time, payload. *(Source: §11.1)*

**FR-9.3** Incoming events are validated against the envelope and the payload schema for their type. *(Source: §11.2)*

**FR-9.4** The event source is authenticated (webhook signature or integration credential, OQ-021). *(Source: §11.2)*

**FR-9.5** Organization and project permissions of the source are enforced before processing. *(Source: §11.2)*

**FR-9.6** Repeated events are deduplicated; duplicates create no tasks or activity. *(Source: §11.2, §16)*

**FR-9.7** The original event payload is stored unchanged. Retention: OQ-023. *(Source: §11.2)*

**FR-9.8** Event data is normalized and the affected canonical records are updated. *(Source: §11.2)*

**FR-9.9** Each event's synchronization result (applied, skipped, conflict, failed, with reason) is recorded. *(Source: §11.2)*

**FR-9.10** Applied changes are broadcast to subscribed clients. *(Source: §11.2)*

**FR-9.11** Failed processing is retried with backoff. *(Source: §11.2)*

**FR-9.12** Events that keep failing go to a dead-letter store where they can be inspected and replayed. *(Source: §11.2)*

**FR-9.13** The dashboard receives realtime updates over Server-Sent Events (task status changed, PR merged, requirement approved, document published, QA completed, milestone updated). *(Source: §11.3)*

**FR-9.14** Realtime delivery sends each recipient only what they may see. *(Source: §11.3)*

**FR-9.15** Event schemas are versioned (`schema_version`) and older supported versions keep being accepted. *(Source: §17.2, §11.1)*

### FR-10 Multi-organization security and sharing

**FR-10.1** Every project belongs to exactly one organization and every repository integration to exactly one project. *(Source: §12.1)*

**FR-10.2** Users reach information only through explicit membership or explicit sharing. *(Source: §12.1)*

**FR-10.3** A project can be shared explicitly with another organization. *(Source: §12.2)*

**FR-10.4** A share carries permissions: read-only, task visibility, document visibility, approval, comment; a share can be revoked. *(Source: §12.2)*

**FR-10.5** Sensitive actions are written to an audit log (who, what, when, before / after). Which actions count as sensitive: OQ-030. *(Source: §12.3, §16)*

### FR-11 Document management

**FR-11.1** Documents come from Git repositories, the platform editor, external documentation services, uploads and generated summaries. *(Source: §13.1)*

**FR-11.2** Users can create and edit documents in a platform-native editor (Markdown). *(Source: §13.1)*

**FR-11.3** Users can upload files as project documents. Storage: OQ-025. *(Source: §13.1)*

**FR-11.4** Each document keeps version history, source references, last-modified information, change history and visibility permissions. *(Source: §13.2)*

**FR-11.5** Document versions can be compared and restored. *(Source: §13.2)*

**FR-11.6** The platform can generate project overview, repository overview, current development state, weekly progress report, release notes and technical summaries as documents. *(Source: §13.3)*

**FR-11.7** External documentation services (e.g. Notion) can be documentation sources through adapters. *(Source: §13.1, §2.1)*

### FR-12 Notifications and reports

**FR-12.1** Users are notified about task assignment, task completion, blocked tasks, PR merge, QA failure, requirement changes, pending approvals and milestone changes. Channels: OQ-026. *(Source: §14.1)*

**FR-12.2** Notifications are configurable per user and per project. *(Source: §14.1)*

**FR-12.3** Reports: daily development summary, weekly project summary, milestone report, requirement change report, outstanding approval report, QA status report. Schedule and time zone: OQ-029. *(Source: §14.2)*

**FR-12.4** Reports are built from structured records; LLM summarization is optional. *(Source: §14.2)*

**FR-12.5** Management can view authorized reports across projects. *(Source: §15 Phase 5, §16)*

### FR-13 External task management

**FR-13.1** External task management systems (Linear, Jira, GitHub / GitLab Issues) can be task sources through adapters. Release placement: OQ-040. *(Source: §15 Phase 5, §2.1, §18)*

---

## 4. Business rules

**BR-001** The platform never assumes that repositories share documentation or task conventions. *(Source: §2.1, §17.1 item 1)*

**BR-002** Authoritative sources: source code → Git repository; commit history, branch and PR status → Git provider; business requirements → approved requirement records; task status → the configured task source; design specifications → design / documentation source; QA results → QA records; client acceptance → explicit approval records; project summary → generated platform representation; AI insights → non-authoritative derived information. *(Source: §2.3)*

**BR-003** AI-generated content never overwrites an approved requirement or any other authoritative record. *(Source: §2.3, §17.1 item 6)*

**BR-004** The latest timestamp is not taken as truth by itself; ownership is defined per entity and per field (Git provider owns PR status, adapter owns Markdown task interpretation, platform owns sharing permissions, approved requirements own scope, QA records own test results). *(Source: §4.8)*

**BR-005** When two sources update the same entity: identify the source authority, compare source versions or event sequence, apply the configured authority rule, keep the previous version, record the result, and flag unresolved conflicts for human review. *(Source: §4.8)*

**BR-006** Conflicting updates are never discarded silently. *(Source: §4.8)*

**BR-007** Work on an unmerged branch never shows as a completed project capability. *(Source: §6.4)*

**BR-008** Commit counts and lines of code are not shown or used as productivity metrics. *(Source: §6.3)*

**BR-009** A commit does not mark a task done. *(Source: §17.1 item 3)*

**BR-010** Merged code does not mean QA acceptance, and code changes never decide business acceptance. *(Source: §17.1 item 4, §1.4)*

**BR-011** An approved requirement changes only through an approved change request; the original approved version is kept. *(Source: §7.3)*

**BR-012** Agent-generated information is marked agent-generated until a person reviews or accepts it. *(Source: §10.3)*

**BR-013** Generated documents and summaries stay distinguishable from authoritative source documents. *(Source: §13.3, §16)*

**BR-014** Clients never get internal repository activity, internal discussions, credentials or private technical documentation unless explicitly shared. *(Source: §8.5)*

**BR-015** Sharing a project never grants access to the rest of the originating organization. *(Source: §12.2)*

**BR-016** Progress figures come from configurable, explainable rules, never from raw Git activity. *(Source: §8.6)*

**BR-017** Task association never relies only on naming conventions; explicit adapter links and manual links are always possible. *(Source: §6.2)*

**BR-018** Vector / semantic search is not introduced before structured retrieval is shown insufficient. *(Source: §17.1 item 8)*

---

## 5. Interfaces

Each boundary has a versioned contract document; payload tables live there, not here.

| Boundary | Contract doc | Requirements |
|---|---|---|
| Integration events → API (`POST /api/integrations/events`) | [`fsd/event-envelope-contract.md`](fsd/event-envelope-contract.md) | FR-9.2, FR-9.15 |
| Repository adapter configuration and logical operations | [`fsd/adapter-contract.md`](fsd/adapter-contract.md) | FR-3.1–FR-3.12 |
| REST API (web, CLI, agents) | [`fsd/rest-api-contract.md`](fsd/rest-api-contract.md) | FR-8.4 |
| MCP tools | [`fsd/mcp-tools-contract.md`](fsd/mcp-tools-contract.md) | FR-8.1, FR-8.2 |
| SSE stream (API → web) | [`fsd/rest-api-contract.md`](fsd/rest-api-contract.md) §SSE | FR-9.13 |
| GitHub App webhooks (external, owned by GitHub) | [`fsd/github-integration.md`](fsd/github-integration.md) | FR-4.1–FR-4.5 |

---

## 6. Non-functional requirements

**NFR-1** Stack: Next.js / React / Tailwind / shadcn/ui front end, Fastify API, PostgreSQL, Redis + BullMQ for background work, SSE for realtime, an MCP server, Markdown + structured JSON documents, Docker deployment (D-001). *(Source: §3.2)*

**NFR-2** Minimal infrastructure: PostgreSQL is the primary source of truth; Redis is used only for queues, caching or other workloads that justify it. *(Source: §3.2)*

**NFR-3** Ordinary Git and task synchronization makes no LLM calls; LLM calls are never mandatory for synchronization. *(Source: §1.1, §2.2, §17.1 item 5, §16)*

**NFR-4** Token economy: no full repository history to LLMs, no full-document regeneration for small changes, deterministic storage of task and activity data, on-demand context, incremental and cached summaries, inexpensive models for routine summaries, source references on generated content. *(Source: §9.5)*

**NFR-5** The context engine and summarization are independent of a specific LLM provider. *(Source: §9.1)*

**NFR-6** Tenant isolation is enforced in the backend: organization-aware authorization on every request and job, PostgreSQL Row-Level Security on tenant tables (scope: OQ-004). *(Source: §12.3, §17.1 item 10)*

**NFR-7** Integration credentials are scoped to one integration; repository credentials are never shared without restriction. *(Source: §12.3)*

**NFR-8** Secrets (GitHub App key, webhook secrets, integration tokens) are encrypted at rest. Method: OQ-021. *(Source: §12.3)*

**NFR-9** Webhook signatures are verified before any processing. *(Source: §12.3)*

**NFR-10** MCP tools and background jobs perform the same permission checks as the REST API. *(Source: §12.3)*

**NFR-11** Architecture constraints: the core is not coupled to any repository structure; Markdown is not the primary database; MCP is not the only integration interface; external providers sit behind adapters. *(Source: §17.1 items 1, 2, 7, 9)*

**NFR-12** Every service ships as a Docker image. *(Source: §3.2)*

**NFR-13** Performance, availability and scale targets: OQ-003 (until answered, the assumed targets in OQ-003 apply). *(Source: none — gap)*

**NFR-14** Data retention for raw event payloads, audit logs and document versions: OQ-023. *(Source: §11.2, §12.3, §13.2 — period not stated)*

**NFR-15** Automated test coverage of at least 80 % over `packages/contracts` and the domain layer, enforced in CI (OQ-032). *(Source: none — bootstrap default)*

**NFR-16** The platform repository documents product, architecture, integrations and development for agents and people, and agents read the relevant documents before implementing. Layout: OQ-033. *(Source: §17.3)*

**NFR-17** Revoked permissions take effect on the next request across web, REST, MCP and SSE (no long-lived cached grants). *(Source: §16 Security, §12.2)*

---

## 7. Assumptions

* The source document is complete in scope; this spec restructures it without adding requirements. Gaps are OQs.
* Interview answers of 2026-11-20 are recorded as D-001 to D-004.
* Source §1.2 (core problems), §1.3 (objectives), §3.1 (architecture diagram) and §19 (definition of
  success) are context: they carry no IDs, and their content is covered by the requirements above (D-008).
* Open questions in state `assumed` are implemented with their proposed position until the owner says otherwise.

---

## 8. Acceptance criteria (Source: §16)

The platform is ready for its initial production deployment when all hold. Each has a section in
[`uat/UAT.md`](uat/UAT.md).

### Repository integration

**AC-1** Two repositories with different directory structures can connect to the same project.

**AC-2** Repositories can use different task management conventions.

**AC-3** Repository adapters can map external statuses to canonical statuses.

**AC-4** Documentation can be discovered without forcing repository restructuring.

**AC-5** Git events update platform records automatically.

**AC-6** Duplicate events do not create duplicate tasks or activity.

**AC-7** Repository synchronization can recover after temporary failures.

**AC-8** Platform records preserve original source references.

### Project management

**AC-9** PMs can see task status across connected repositories.

**AC-10** PMs can identify blocked tasks.

**AC-11** Requirement changes preserve their history.

**AC-12** Requirements can be linked to implementation tasks.

**AC-13** Project progress is calculated using transparent rules.

### AI integration

**AC-14** Claude Code can retrieve project context through MCP.

**AC-15** AI agents can retrieve repository-specific context.

**AC-16** AI agents can publish structured progress updates.

**AC-17** AI-generated summaries are distinguishable from authoritative data.

**AC-18** Ordinary Git and task updates do not require LLM calls.

**AC-19** Context retrieval respects user and organization permissions.

### Non-development collaboration

**AC-20** PMs can access a project dashboard without Git access.

**AC-21** Designers can publish and review design references.

**AC-22** QA can access acceptance criteria and record test results.

**AC-23** Clients can view explicitly shared project information.

**AC-24** Clients can submit approvals and change requests.

**AC-25** Management can view authorized cross-project reports.

### Security

**AC-26** Organization isolation is enforced.

**AC-27** Cross-organization sharing requires explicit authorization.

**AC-28** Revoked permissions take effect across API and MCP.

**AC-29** Integration secrets are protected.

**AC-30** All sensitive write operations are auditable.
