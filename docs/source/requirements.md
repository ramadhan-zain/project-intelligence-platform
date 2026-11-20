# Project Intelligence Platform
## Product Requirements & Technical Development Specification

**Status:** Draft  
**Document type:** Product and Technical Specification  
**Architecture:** Multi-tenant, event-driven, Git-first, repository-agnostic  
**Primary objective:** Provide a shared, continuously updated source of project knowledge across development and non-development teams.

---

# 1. Product Overview

## 1.1. Vision

Build a centralized project intelligence platform that synchronizes project information from multiple repositories, task management systems, documentation sources, and team activities.

The platform provides a unified interface for developers, project managers, designers, QA engineers, management, and clients to access relevant project information.

It also acts as a shared context provider for AI coding agents, including Claude Code, OpenCode, and other MCP-compatible tools.

The platform must minimize LLM consumption by prioritizing deterministic data synchronization and structured event processing over repeated AI-generated document updates.

## 1.2. Core Problems

1. Project information is distributed across repositories, Markdown files, task management tools, and communication channels.
2. Developers frequently need to manually communicate development progress to project managers.
3. AI coding agents repeatedly consume large documentation files to understand project context.
4. Different repositories use different task management and documentation conventions.
5. Non-development team members lack visibility into actual implementation progress.
6. Requirements and scope changes are difficult to trace back to implementation.
7. Project history and technical decisions are frequently lost between team members.
8. Clients require project updates without needing access to internal development infrastructure.

## 1.3. Product Objectives

- Establish a centralized project information system.
- Automatically synchronize Git and repository activity.
- Support heterogeneous repository structures and workflows.
- Connect business requirements to implementation and testing.
- Provide role-specific project interfaces.
- Enable selective cross-organization project sharing.
- Provide efficient AI context retrieval through APIs and MCP.
- Reduce repetitive reporting and documentation maintenance.
- Preserve historical changes and auditability.

## 1.4. Non-Objectives

The initial product is not intended to:

- Replace GitHub, GitLab, or other Git providers.
- Replace every existing task management platform.
- Force all repositories to use one directory structure.
- Replace Figma or other design tools.
- Replace existing CI/CD infrastructure.
- Require LLM processing for every repository event.
- Automatically determine business acceptance from code changes.
- Require developers to migrate all existing documentation.

---

# 2. Core Architectural Principles

## 2.1. Canonical Data Model

The platform maintains a standardized internal data model.

External repositories and services can use any structure they want, provided they can translate their information into the platform's canonical contract.

For example:

Repository A:
- Uses `BACKLOG.md`.
- Uses GitHub Issues.
- Tracks development progress using Claude Code hooks.

Repository B:
- Uses `TASKS.md`.
- Uses GitLab Issues.
- Tracks development progress using custom scripts.

Repository C:
- Uses Linear.
- Stores documentation in Notion.
- Uses a custom release process.

All three repositories can provide the same canonical information to the platform.

**The platform must not assume that all repositories share identical documentation or task management conventions.**

## 2.2. Event-Driven Synchronization

Updates should be triggered by events rather than continuous polling or repeated LLM analysis.

Examples:

- Git push.
- Pull request creation.
- Pull request merge.
- Task status change.
- Documentation modification.
- Requirement approval.
- QA result submission.
- Client approval.

Each event should be validated, normalized, stored, and processed.

## 2.3. Source of Truth

The platform must distinguish between authoritative information and synchronized representations.

| Information | Authoritative source |
|---|---|
| Source code | Git repository |
| Commit history | Git provider |
| Branch and PR status | Git provider |
| Business requirements | Approved requirement records |
| Task status | Configured task source |
| Design specifications | Design/documentation source |
| QA results | QA records |
| Client acceptance | Explicit approval records |
| Project summary | Generated platform representation |
| AI-generated insights | Non-authoritative derived information |

The platform must preserve source references and provenance.

An AI-generated summary must never silently overwrite an approved business requirement.

---

# 3. System Architecture

## 3.1. High-Level Architecture

    ┌──────────────────────────────────────────────┐
    │                Data Sources                   │
    ├──────────────────────────────────────────────┤
    │ GitHub │ GitLab │ Markdown │ Linear │ Figma   │
    │ Claude Code │ Manual Input │ External APIs    │
    └──────────────────────┬───────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │           Integration / Adapter Layer        │
    ├──────────────────────────────────────────────┤
    │ Repository Adapters                          │
    │ Git Provider Adapters                        │
    │ Documentation Adapters                       │
    │ Task Management Adapters                     │
    │ Agent Integration Adapters                   │
    └──────────────────────┬───────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │             Event Ingestion Layer            │
    ├──────────────────────────────────────────────┤
    │ Validation │ Authentication │ Normalization  │
    │ Deduplication │ Authorization │ Event Queue  │
    └──────────────────────┬───────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │             Central Data Platform            │
    ├──────────────────────────────────────────────┤
    │ Organizations │ Projects │ Repositories      │
    │ Tasks │ Requirements │ Documents │ Decisions │
    │ Activity │ Releases │ QA │ Approvals         │
    └──────────────────────┬───────────────────────┘
                           │
             ┌─────────────┼──────────────┐
             ▼             ▼              ▼
       Web Dashboard    REST / MCP    Realtime
             │             │              │
             ▼             ▼              ▼
        Human Teams     AI Agents     Live Updates

## 3.2. Recommended Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, Tailwind CSS, shadcn/ui |
| Backend API | Fastify |
| Database | PostgreSQL |
| Background processing | Redis + BullMQ |
| Realtime | Server-Sent Events (SSE) |
| AI integration | MCP server |
| Git integration | GitHub App / GitLab integrations |
| Authentication | Organization-aware authentication |
| Document representation | Markdown + structured JSON |
| Deployment | Docker |

The initial implementation should avoid unnecessary infrastructure.

PostgreSQL should be the primary source of truth. Redis should only be introduced for background processing, caching, or other workloads that justify it.

---

# 4. Repository-Agnostic Integration Contract

This is one of the most important parts of the system.

## 4.1. Problem

Different repositories have different conventions.

The platform must not require developers to restructure existing repositories just to integrate them.

Examples of different repository structures:

### Repository A

    project-a/
    ├── CLAUDE.md
    ├── BACKLOG.md
    ├── docs/
    │   ├── architecture.md
    │   └── requirements.md
    └── src/

### Repository B

    project-b/
    ├── AGENTS.md
    ├── TASKS.md
    ├── documentation/
    │   ├── system-design.md
    │   └── specifications.md
    └── app/

### Repository C

    project-c/
    ├── README.md
    ├── .project/
    │   ├── roadmap.json
    │   ├── tasks.json
    │   └── decisions/
    └── packages/

These repositories may contain equivalent information despite using different structures.

The platform needs a translation mechanism.

## 4.2. Repository Adapter

Each repository must be able to register an adapter.

An adapter describes:

1. How to discover repository information.
2. Where tasks are stored.
3. How task statuses are interpreted.
4. Where requirements are stored.
5. How technical documentation is discovered.
6. How implementation activity is reported.
7. Which events should be synchronized.
8. How canonical platform entities map back to repository entities.

An adapter can be implemented as:

- A repository configuration file.
- A custom integration script.
- A GitHub Action.
- A CLI integration.
- A platform-provided plugin.
- An external integration service.

The platform must not require a specific adapter implementation language.

## 4.3. Proposed Configuration File

Recommended filename:

    .project-sync.yaml

Example:

    version: 1

    platform:
      project_id: project_123
      integration_id: integration_456

    repository:
      name: hongqi-platform
      default_branch: main

    synchronization:
      mode: push
      events:
        - git.push
        - git.pull_request
        - task.updated
        - documentation.updated

    tasks:
      source: markdown
      path: BACKLOG.md

      mapping:
        id_pattern: "TASK-\\d+"
        title: heading
        description: body
        status:
          pending: todo
          in_progress: in_progress
          completed: done
          blocked: blocked

    documentation:
      sources:
        - path: CLAUDE.md
          type: agent_instructions
        - path: docs/architecture.md
          type: architecture
        - path: docs/requirements.md
          type: requirements

    decisions:
      path: docs/decisions/

    activity:
      include_commits: true
      include_pull_requests: true

This configuration is illustrative. The platform must support adapters that do not use this configuration format.

## 4.4. Adapter Responsibilities

An adapter must implement the following logical operations:

| Operation | Description |
|---|---|
| `discover()` | Discover available project information |
| `getTasks()` | Retrieve tasks from the repository's task source |
| `getDocuments()` | Discover and retrieve documentation |
| `getRequirements()` | Retrieve requirements |
| `getDecisions()` | Retrieve technical decisions |
| `normalize()` | Translate external structures into canonical entities |
| `publishEvent()` | Publish incremental updates |
| `resolveReference()` | Map canonical entities back to source locations |
| `healthCheck()` | Check integration availability |

The platform should define these as a logical contract, not require every adapter to implement an identical programming interface.

For example, a webhook-based integration may not need to implement `getTasks()` during normal operation.

## 4.5. Integration Modes

Support three integration modes.

### Mode A: Push-based

The repository actively sends information to the platform.

Examples:
- GitHub webhooks.
- Claude Code hooks.
- GitHub Actions.
- Custom CLI scripts.

Advantages:
- Fast updates.
- Minimal polling.
- Suitable for live synchronization.

### Mode B: Pull-based

The platform periodically retrieves repository information.

Examples:
- Fetch `BACKLOG.md`.
- Read repository documentation.
- Retrieve issue status.
- Discover new documentation files.

Advantages:
- Suitable for repositories with limited automation.
- Useful for initial synchronization.
- Does not require extensive repository-side modifications.

### Mode C: Hybrid

Use webhooks for incremental updates and scheduled synchronization for consistency checks.

**Recommended default: Hybrid.**

## 4.6. Canonical Task Schema

Every repository adapter must be able to provide a normalized task representation.

Example:

    {
      "external_id": "TASK-102",
      "title": "Implement authentication middleware",
      "description": "Add JWT validation.",
      "status": "in_progress",
      "priority": "high",
      "assignee": {
        "external_id": "developer-01"
      },
      "labels": ["backend", "authentication"],
      "source": {
        "type": "markdown",
        "path": "BACKLOG.md",
        "reference": "TASK-102"
      },
      "relationships": {
        "requirement_ids": ["REQ-012"],
        "parent_task_id": null
      },
      "updated_at": "2026-11-20T10:00:00Z"
    }

Canonical task statuses:

- `backlog`
- `todo`
- `in_progress`
- `in_review`
- `blocked`
- `done`
- `cancelled`

External statuses must be mapped to canonical statuses through adapter configuration.

The platform must preserve the original status value as source metadata.

## 4.7. Canonical Documentation Schema

Documentation sources should be registered individually.

Example:

    {
      "external_id": "DOC-001",
      "title": "System Architecture",
      "type": "architecture",
      "format": "markdown",
      "content": "# Architecture...",
      "source": {
        "repository_id": "repo_001",
        "path": "docs/architecture.md",
        "branch": "main",
        "commit_sha": "abc123"
      },
      "visibility": "organization",
      "version": 4,
      "updated_at": "2026-11-20T10:00:00Z"
    }

Supported document categories:

- `overview`
- `architecture`
- `requirements`
- `specification`
- `agent_instructions`
- `technical_decision`
- `development_notes`
- `deployment`
- `testing`
- `release_notes`
- `custom`

Unknown categories must remain supported through `custom` and metadata.

## 4.8. Synchronization Conflict Rules

The platform must not assume that the latest timestamp always represents the correct information.

Define source ownership per entity and field.

Examples:

- A Git provider owns PR status.
- A repository adapter owns the interpretation of Markdown tasks.
- The platform owns cross-organization sharing permissions.
- Approved requirements own business scope.
- QA records own test results.

When two sources update the same entity:

1. Identify the source authority.
2. Compare source versions or event sequence.
3. Apply the configured authority rule.
4. Preserve the previous version.
5. Record the synchronization result.
6. Flag unresolved conflicts for human review.

Do not silently discard conflicting updates.

---

# 5. Central Data Model

## 5.1. Main Entities

### Organization

Represents a company or organizational tenant.

Fields:
- id
- name
- slug
- settings
- created_at

### Organization Member

Fields:
- organization_id
- user_id
- role
- status

### Project

Fields:
- id
- organization_id
- name
- description
- status
- visibility
- project_manager_id
- start_date
- target_date

### Project Member

Fields:
- project_id
- user_id
- role
- permissions

### Repository

Fields:
- id
- project_id
- provider
- external_repository_id
- repository_url
- default_branch
- integration_status
- last_synchronized_at

### Repository Integration

Fields:
- id
- repository_id
- adapter_type
- adapter_version
- configuration
- synchronization_mode
- status

### Task

Fields:
- id
- project_id
- external_id
- title
- description
- status
- priority
- assignee_id
- due_date
- source_reference
- created_at
- updated_at

### Requirement

Fields:
- id
- project_id
- requirement_code
- title
- description
- status
- version
- priority
- acceptance_criteria
- approval_status

### Project Document

Fields:
- id
- project_id
- repository_id
- title
- document_type
- content
- source_reference
- version
- visibility
- updated_at

### Technical Decision

Fields:
- id
- project_id
- title
- context
- decision
- consequences
- source_reference
- created_by
- created_at

### Project Event

Fields:
- id
- organization_id
- project_id
- repository_id
- event_type
- source
- external_event_id
- payload
- created_at

### Pull Request

Fields:
- id
- repository_id
- external_id
- branch
- target_branch
- title
- status
- author_id
- merged_at
- external_url

### QA Result

Fields:
- id
- project_id
- task_id
- requirement_id
- test_status
- result
- tested_by
- tested_at

### Approval

Fields:
- id
- project_id
- entity_type
- entity_id
- approval_type
- status
- approved_by
- approved_at
- comments

## 5.2. Relationships

The platform must support relationships between:

- Organizations and projects.
- Projects and repositories.
- Projects and requirements.
- Requirements and tasks.
- Tasks and pull requests.
- Tasks and commits.
- Tasks and QA results.
- Requirements and approvals.
- Documents and source repositories.
- Technical decisions and implementation changes.

Relationships should not require every repository to implement every entity type.

---

# 6. Git Integration

## 6.1. Supported Events

Initial Git provider support should include:

- Repository connected.
- Branch created.
- Push received.
- Commit created.
- Pull request opened.
- Pull request updated.
- Pull request approved.
- Pull request rejected or changes requested.
- Pull request merged.
- Pull request closed.
- Release published.

## 6.2. Task Association

The system should identify task relationships through:

1. Explicit task IDs in branch names.
2. Task IDs in commit messages.
3. Pull request descriptions.
4. Explicit links from the repository adapter.
5. Manual association through the dashboard.

Example:

    feature/TASK-102-authentication

    feat(auth): implement JWT validation [TASK-102]

The platform must not rely exclusively on naming conventions.

## 6.3. Development Activity

Record:

- Commit count.
- Changed files.
- Associated tasks.
- Pull request status.
- Branch status.
- Merge date.
- Author.
- Source references.

Avoid treating raw commit counts or lines of code as reliable productivity metrics.

## 6.4. Branch-specific Context

Maintain separate states for:

- Canonical project state.
- Active branch development state.
- Merged implementation state.
- Released implementation state.

A feature being developed in a branch must not automatically appear as a completed project capability.

---

# 7. Task and Requirement Management

## 7.1. Task Management

Provide a platform-native task interface while allowing external task sources to remain authoritative.

Features:

- Task creation.
- Assignment.
- Status updates.
- Priority.
- Labels.
- Due dates.
- Comments.
- Task dependencies.
- Source references.
- Change history.

## 7.2. Requirement Management

Requirements must have explicit identifiers and version history.

Example:

    REQ-012: User Authentication

    Version: 2
    Status: approved

    Description:
    Users must be able to authenticate using email and password.

    Acceptance Criteria:
    - Valid credentials allow login.
    - Invalid credentials are rejected.
    - Sessions expire according to policy.

## 7.3. Change Requests

Any modification to an approved requirement should be traceable.

Example:

    CR-001
    Related requirement: REQ-012

    Description:
    Add support for two-factor authentication.

    Reason:
    Client requested additional authentication security.

    Impact:
    - Backend implementation
    - Login UI
    - QA test scenarios
    - Delivery estimate

    Approval:
    Pending client approval

Change requests must preserve the original approved requirement.

## 7.4. Requirement Traceability

The platform should provide a complete relationship:

    Requirement
        ↓
    Design Specification
        ↓
    Development Task
        ↓
    Git Branch / Pull Request
        ↓
    Merged Implementation
        ↓
    QA Result
        ↓
    Client Acceptance

This relationship is a primary product capability.

---

# 8. Role-Based Interfaces

## 8.1. Developer Interface

Features:
- Assigned tasks.
- Project technical context.
- Architecture documentation.
- Active development activity.
- Related requirements.
- Pull request status.
- Technical decisions.
- AI context retrieval.

## 8.2. Project Manager Interface

Features:
- Project progress.
- Task distribution.
- Milestones.
- Blocked tasks.
- Outstanding approvals.
- Requirement changes.
- Delivery risks.
- Progress reporting.

## 8.3. Designer Interface

Features:
- Design-related requirements.
- Figma references.
- Design approval status.
- Implementation progress.
- Design feedback.
- Outstanding design dependencies.

## 8.4. QA Interface

Features:
- Tasks ready for testing.
- Associated requirements.
- Acceptance criteria.
- Pull request references.
- Test scenarios.
- Bug reports.
- Test results.
- Regression tracking.

## 8.5. Client Interface

Features:
- Project overview.
- Milestones.
- Completed deliverables.
- Upcoming work.
- Pending approvals.
- Change requests.
- Release notes.
- Project documents.

Clients must not automatically receive access to internal repository activity, internal discussions, credentials, or private technical documentation.

## 8.6. Management Interface

Features:
- Organization-wide project overview.
- Project health.
- Delayed milestones.
- Resource allocation.
- Pending client approvals.
- Scope changes.
- Project reporting.

Progress calculations must use configurable and explainable rules rather than raw Git activity.

---

# 9. AI Context Engine

## 9.1. Purpose

Provide AI agents with the minimum relevant information required to understand and work on a project.

The context engine must be independent of a specific LLM provider.

## 9.2. Context Categories

- Project overview.
- Repository overview.
- Architecture.
- Coding conventions.
- Active tasks.
- Recent development activity.
- Technical decisions.
- Requirements.
- Known issues.
- Deployment instructions.

## 9.3. Context Retrieval

Example:

    get_project_overview(project_id)

    get_repository_context(repository_id)

    get_project_tasks(
      project_id,
      status="in_progress"
    )

    get_recent_activity(
      project_id,
      limit=10
    )

    get_related_requirements(task_id)

    get_technical_decisions(
      project_id,
      query="authentication"
    )

Retrieval must support filtering by:

- Organization.
- Project.
- Repository.
- Task.
- Requirement.
- Document category.
- Date range.
- User permissions.

## 9.4. AI Summarization

Use LLMs only when semantic understanding is necessary.

Examples:

- Generate project summaries.
- Explain architectural changes.
- Identify possible inconsistencies.
- Summarize development activity.
- Generate weekly reports.
- Identify potential requirement impacts.

Summaries should be cached and invalidated when their underlying records change.

## 9.5. Token Optimization

The system should:

- Avoid sending full repository history to LLMs.
- Avoid regenerating entire documents for minor updates.
- Store deterministic task and activity data.
- Retrieve context on demand.
- Use incremental summarization.
- Cache generated summaries.
- Use inexpensive models for routine summaries.
- Preserve source references for generated information.

Every generated summary should record:
- Model/provider.
- Generation timestamp.
- Input record versions.
- Source references.
- Generation status.

---

# 10. MCP and API Integration

## 10.1. MCP Server

Expose project intelligence through a custom MCP server.

Initial read tools:

- `get_project_overview`
- `get_repository_context`
- `get_project_tasks`
- `get_recent_activity`
- `get_project_requirements`
- `get_technical_decisions`
- `get_document`
- `get_related_entities`

Initial write tools:

- `update_task_status`
- `add_project_note`
- `publish_progress`
- `create_change_request`
- `submit_implementation_summary`

Write operations must validate authorization and source ownership.

## 10.2. REST API

The platform should expose equivalent REST endpoints for non-MCP clients.

Example:

    GET /api/projects/:projectId
    GET /api/projects/:projectId/tasks
    GET /api/projects/:projectId/documents
    GET /api/projects/:projectId/activity

    POST /api/integrations/events
    POST /api/projects/:projectId/change-requests

    PATCH /api/tasks/:taskId
    POST /api/tasks/:taskId/comments

## 10.3. Agent Integration

Claude Code and other coding agents should be able to:

1. Retrieve project context.
2. Retrieve assigned tasks.
3. Publish implementation progress.
4. Associate work with tasks.
5. Publish technical decisions.
6. Report completion.
7. Retrieve relevant documentation.

Agent-generated information must be marked as agent-generated until reviewed or accepted where appropriate.

---

# 11. Realtime and Event Processing

## 11.1. Event Structure

Every integration should publish events using a standard envelope.

Example:

    {
      "event_id": "evt_123",
      "event_type": "task.updated",
      "schema_version": 1,
      "organization_id": "org_123",
      "project_id": "project_123",
      "repository_id": "repo_123",
      "source": {
        "type": "repository_adapter",
        "name": "markdown-adapter"
      },
      "entity": {
        "type": "task",
        "external_id": "TASK-102"
      },
      "occurred_at": "2026-11-20T10:00:00Z",
      "payload": {
        "status": "done"
      }
    }

## 11.2. Event Processing Requirements

- Validate event schema.
- Authenticate event source.
- Enforce organization and project permissions.
- Deduplicate repeated events.
- Preserve original payload.
- Normalize event data.
- Update relevant records.
- Record synchronization results.
- Broadcast changes.
- Retry failed processing.
- Support dead-letter handling.

## 11.3. Realtime Updates

Use SSE for dashboard notifications and updates.

Examples:

- Task status changed.
- PR merged.
- Requirement approved.
- New document published.
- QA completed.
- Project milestone updated.

Realtime delivery must respect the recipient's access permissions.

---

# 12. Multi-Organization Security

## 12.1. Tenant Isolation

Every project belongs to an organization.

Every repository integration must belong to a project.

Users can access information only through explicit membership or sharing permissions.

## 12.2. Cross-Organization Sharing

Support explicit project sharing between organizations.

Example:

    Organization A
        └── Project A
              ├── Internal developers
              ├── Internal PM
              └── Shared with Organization B
                    └── Client members

Sharing must support:

- Read-only access.
- Task visibility.
- Document visibility.
- Approval permissions.
- Comment permissions.
- Revocation.

Sharing must never imply access to the entire originating organization.

## 12.3. Security Requirements

- Organization-aware authorization.
- PostgreSQL Row-Level Security where appropriate.
- Scoped integration credentials.
- Encrypted secrets.
- Webhook signature verification.
- Audit logs.
- Explicit cross-organization permissions.
- Permission checks in MCP tools.
- Permission checks in background jobs.
- No unrestricted repository credential sharing.

---

# 13. Document Management

## 13.1. Document Sources

Support documents from:

- Git repositories.
- Platform-native editor.
- External documentation services.
- Uploaded files.
- Generated summaries.

## 13.2. Document Versioning

Each document must support:

- Version history.
- Source references.
- Last modified information.
- Change history.
- Visibility permissions.
- Restore or compare operations.

## 13.3. Generated Documents

The platform may generate:

- Project overview.
- Repository overview.
- Current development state.
- Weekly progress report.
- Release notes.
- Technical summaries.

Generated documents must remain distinguishable from authoritative source documents.

---

# 14. Notifications and Reporting

## 14.1. Notifications

Notify relevant users about:

- Task assignment.
- Task completion.
- Blocked tasks.
- PR merge.
- QA failure.
- Requirement changes.
- Pending approvals.
- Milestone changes.

Notifications must be configurable by user and project.

## 14.2. Reports

Support:

- Daily development summary.
- Weekly project summary.
- Project milestone report.
- Requirement change report.
- Outstanding approval report.
- QA status report.

Reports should be generated primarily from structured records.

LLM summarization is optional.

---

# 15. MVP Scope

The first release should prioritize the foundation rather than implementing every integration.

## Phase 1: Core Platform

- Organization management.
- User management.
- Project management.
- Repository registration.
- Canonical data model.
- Task management.
- Document management.
- Project activity timeline.
- Basic role-based access control.

## Phase 2: Git-First Synchronization

- GitHub App integration.
- Repository webhooks.
- Commit synchronization.
- Pull request synchronization.
- Task association.
- Repository adapter configuration.
- Markdown task adapter.
- Documentation discovery.
- Initial synchronization.
- Incremental synchronization.

## Phase 3: AI Integration

- MCP server.
- Project context retrieval.
- Repository context retrieval.
- Task retrieval.
- Development activity retrieval.
- Claude Code hooks integration.
- Implementation summary publishing.
- Context caching.

## Phase 4: Cross-Functional Collaboration

- Requirement management.
- Change request management.
- Client approval workflow.
- Designer interface.
- QA interface.
- Client portal.
- Project reports.
- Notifications.

## Phase 5: Advanced Intelligence

- Semantic search.
- AI-generated summaries.
- Change impact analysis.
- Automated QA scenario generation.
- Cross-project reporting.
- Additional Git providers.
- External task management integrations.

---

# 16. Acceptance Criteria

The platform is considered ready for its initial production deployment when the following requirements are satisfied.

### Repository Integration

- [ ] Two repositories with different directory structures can connect to the same project.
- [ ] Repositories can use different task management conventions.
- [ ] Repository adapters can map external statuses to canonical statuses.
- [ ] Documentation can be discovered without forcing repository restructuring.
- [ ] Git events update platform records automatically.
- [ ] Duplicate events do not create duplicate tasks or activity.
- [ ] Repository synchronization can recover after temporary failures.
- [ ] Platform records preserve original source references.

### Project Management

- [ ] PMs can see task status across connected repositories.
- [ ] PMs can identify blocked tasks.
- [ ] Requirement changes preserve their history.
- [ ] Requirements can be linked to implementation tasks.
- [ ] Project progress is calculated using transparent rules.

### AI Integration

- [ ] Claude Code can retrieve project context through MCP.
- [ ] AI agents can retrieve repository-specific context.
- [ ] AI agents can publish structured progress updates.
- [ ] AI-generated summaries are distinguishable from authoritative data.
- [ ] Ordinary Git and task updates do not require LLM calls.
- [ ] Context retrieval respects user and organization permissions.

### Non-Development Collaboration

- [ ] PMs can access a project dashboard without Git access.
- [ ] Designers can publish and review design references.
- [ ] QA can access acceptance criteria and record test results.
- [ ] Clients can view explicitly shared project information.
- [ ] Clients can submit approvals and change requests.
- [ ] Management can view authorized cross-project reports.

### Security

- [ ] Organization isolation is enforced.
- [ ] Cross-organization sharing requires explicit authorization.
- [ ] Revoked permissions take effect across API and MCP.
- [ ] Integration secrets are protected.
- [ ] All sensitive write operations are auditable.

---

# 17. Development Guidelines

## 17.1. Architectural Constraints

1. Do not couple the central platform to a specific repository structure.
2. Do not make Markdown the primary database.
3. Do not assume Git commits represent task completion.
4. Do not assume merged code represents QA acceptance.
5. Do not make LLM calls mandatory for synchronization.
6. Do not let AI-generated summaries overwrite authoritative records.
7. Do not make MCP the only integration interface.
8. Do not introduce vector search before structured retrieval is insufficient.
9. Keep external provider integrations isolated behind adapters.
10. Keep organization permissions enforced at the backend.

## 17.2. Repository Adapter Compatibility

Adapters must be versioned independently.

The platform should support:

- Adapter versioning.
- Event schema versioning.
- Configuration validation.
- Integration health checks.
- Synchronization diagnostics.
- Retry and recovery.
- Incremental synchronization.
- Full resynchronization.

Changes to the canonical schema should not require every repository to immediately restructure its local files.

Use explicit schema migrations and adapter compatibility rules.

## 17.3. Documentation and Agent Instructions

The platform's own repository should contain:

    README.md
    AGENTS.md
    docs/
      product/
        requirements.md
        user-roles.md
      architecture/
        system-overview.md
        data-model.md
        event-processing.md
        repository-adapters.md
        security.md
      integrations/
        github.md
        mcp.md
        adapter-contract.md
      development/
        roadmap.md
        backlog.md

Development agents should read the relevant documentation before implementing features.

---

# 18. Future Considerations

Potential future capabilities:

- GitLab and Bitbucket integration.
- Linear, Jira, and other task management adapters.
- Figma integration.
- Google Workspace integration.
- Slack and Microsoft Teams integration.
- Client-specific project portals.
- Automated project risk detection.
- Cross-project resource planning.
- AI-assisted project management.
- Repository architecture change detection.
- Automated requirement-to-code traceability.
- Custom adapter marketplace.

These should not block the initial implementation.

---

# 19. Definition of Success

The platform should eventually achieve the following:

**For developers:**
- Less time maintaining duplicate documentation.
- Less time explaining project context to AI agents.
- Better awareness of requirements and technical decisions.

**For project managers:**
- Less manual progress reporting.
- Better visibility into actual implementation status.
- Better requirement and scope management.

**For QA:**
- Clearer testing responsibilities.
- Better traceability between requirements and implementations.

**For designers:**
- Better design-to-development visibility.
- Clearer feedback and approval workflows.

**For clients:**
- Transparent project progress.
- Easier approvals.
- Better visibility into deliverables.

**For management:**
- Centralized project visibility.
- Better resource and delivery planning.
- More reliable project reporting.

**For the organization:**
- A reusable project intelligence infrastructure that works across different repositories, workflows, and technology stacks.

---

# 20. Primary Architectural Decision

The central platform owns the canonical project information model.

Repositories and external services own their respective source information.

Adapters translate between the two.

Events synchronize changes.

The dashboard provides human interfaces.

MCP and REST provide machine interfaces.

AI provides semantic interpretation and summarization when needed.

This separation is mandatory for maintaining compatibility across multiple repositories and organizations without imposing a single development workflow.

**The platform must adapt to the repository, not require the repository to adapt to the platform.**
