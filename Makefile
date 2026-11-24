# Project Intelligence Platform — `make help` lists targets.
SHELL := /bin/sh
DEV  := docker compose -f infra/compose.yml
TEST := docker compose -f infra/docker-compose.test.yml
PROD := docker compose -f infra/prod/stack.yml

.DEFAULT_GOAL := help
.PHONY: help install dev-env dev-up dev-deps down clean logs build lint format typecheck test test-up \
	      test-down test-integration schemas trace images db-migrate db-schema mock-github-ping dev

help: ## List targets
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z0-9_-]+:.*## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies from the lockfile
	pnpm install --frozen-lockfile

dev-env: ## Write infra/.env with random secrets (never overwrites)
	./infra/dev-env.sh

ENV := set -a; . infra/.env; set +a;

dev: dev-deps ## Local dev: PostgreSQL + Redis in Docker, apps on the host with watch (web :3000, api :3001)
	$(ENV) pnpm dev

dev-up: dev-deps ## Build and start the full stack in Docker (http://localhost:8088)
	$(DEV) up -d --build --wait

dev-deps: dev-env ## Start only PostgreSQL and Redis, then apply migrations
	$(DEV) up -d --wait postgres redis
	$(MAKE) db-migrate

db-migrate: ## Create/update the app role and apply migrations as the owner (forward-only, OQ-036)
	$(ENV) pnpm db:migrate

down: ## Stop the dev stack (keeps volumes)
	$(DEV) down

clean: ## Stop the dev stack and delete its volumes and build output
	$(DEV) down -v --remove-orphans
	rm -rf coverage apps/*/dist packages/*/dist apps/web/.next

logs: ## Follow dev stack logs
	$(DEV) logs -f --tail=100

build: ## Build all packages and apps
	pnpm build

lint: ## Biome + dependency rules + type check
	pnpm lint
	pnpm typecheck

format: ## Format and auto-fix
	pnpm format

typecheck: ## Type check every package
	pnpm typecheck

test: ## Unit + contract tests with coverage gate (80 % over contracts + domain)
	pnpm test

test-up: ## Start integration-test dependencies (ports 55432, 56379)
	$(TEST) up -d --wait

test-down: ## Stop integration-test dependencies
	$(TEST) down -v

test-integration: test-up ## Integration tests against infra/docker-compose.test.yml
	pnpm test:integration

schemas: ## Regenerate contract JSON Schema snapshots (after an intended contract change)
	pnpm schemas

trace: ## Traceability check; writes docs/fsd/traceability.md
	python3 tools/trace.py --write

images: ## Build all service images tagged with the root version
	@v=$$(node -p "require('./package.json').version"); \
	for s in api worker mcp web; do \
	  docker build -f apps/$$s/Dockerfile --build-arg RELEASE_VERSION=$$v -t pip-$$s:$$v . || exit 1; \
	done

db-schema: ## Regenerate docs/db-schema.md from migrations (implemented with T-021)
	@echo "db-schema: no tables yet (T-021)"

mock-github-ping: ## Send the GitHub `ping` fixture to the dev stack (needs GITHUB_WEBHOOK_SECRET)
	$(ENV) node --import tsx tools/github_mock/src/send.ts ping ping
