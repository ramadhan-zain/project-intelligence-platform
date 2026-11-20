# Deployment runbook

Production runs as Docker Compose on one host (D-002) behind Caddy with automatic TLS (OQ-024).
Rollback and hotfix: [`RELEASE.md`](RELEASE.md). Incidents: [`OPERATIONS.md`](OPERATIONS.md).
Commands run on the production host as a non-root user in the `docker` group, from `/opt/pip` unless noted.

## 0. What you need

* A Linux VM (Ubuntu 24.04 LTS or similar), 2 vCPU, 4 GB RAM, 40 GB disk minimum (sized for OQ-003 targets).
* A DNS name pointing at the VM (A / AAAA record); ports 80 and 443 open inbound, 22 for administration.
* Read access to the images `ghcr.io/ramadhan-zain/pip-{api,worker,mcp,web}` (public repository → public
  packages, or a GitHub token with `read:packages`).
* For Git sync: the GitHub App id, private key and webhook secret (T-003 / T-040).
* The release to deploy, e.g. `v0.1.0`.

## 1. Base system

```sh
sudo apt-get update && sudo apt-get -y upgrade
curl -fsSL https://get.docker.com | sudo sh          # Docker Engine + compose plugin
sudo usermod -aG docker "$USER" && newgrp docker
sudo timedatectl set-timezone UTC
sudo ufw allow 22,80,443/tcp && sudo ufw --force enable
```

## 2. Code and runtime files

Only the infra files are needed on the host, not the source:

```sh
sudo mkdir -p /opt/pip && sudo chown "$USER" /opt/pip && cd /opt/pip
git clone --depth 1 --branch v0.1.0 https://github.com/ramadhan-zain/project-intelligence-platform.git src
cp -r src/infra/prod src/infra/caddy . && mkdir -p backup
```

Result: `/opt/pip/prod/stack.yml`, `/opt/pip/caddy/Caddyfile`, `/opt/pip/backup/`.

## 3. Secrets and configuration

```sh
cd /opt/pip/prod
cp ../src/.env.example .env && chmod 600 .env
```

Edit `.env`:

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | `openssl rand -hex 24` |
| `SESSION_SECRET`, `SECRETS_ENCRYPTION_KEY` | `openssl rand -hex 32` each; keep a copy of `SECRETS_ENCRYPTION_KEY` in the password manager — without it encrypted integration secrets are lost |
| `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_WEBHOOK_SECRET` | from the GitHub App settings |
| `PIP_VERSION` | the release, e.g. `v0.1.0` (never `latest`) |
| `PIP_IMAGE_REGISTRY` | `ghcr.io/ramadhan-zain` |
| `SITE_ADDRESS` | the DNS name, e.g. `pip.example.org` |

Leave `DATABASE_URL` / `REDIS_URL` as they are: the stack overrides them with the internal service names.

## 4. Start the stack

```sh
cd /opt/pip/prod
docker compose -f stack.yml pull
docker compose -f stack.yml up -d --wait
docker compose -f stack.yml ps            # every service "healthy"
```

Database migrations run with `docker compose -f stack.yml run --rm api node dist/migrate.js` once T-020 lands.

## 5. Per-integration setup

**GitHub App** (T-040): App settings → Webhook URL `https://$SITE_ADDRESS/api/webhooks/github`, secret =
`GITHUB_WEBHOOK_SECRET`; permissions and events as `docs/fsd/github-integration.md`. Install the App on the
repositories to connect. Redeliver one webhook from the App's "Advanced" page and check it appears on the
project timeline.

**Claude Code / MCP clients** (T-063): users create an API token in the dashboard and add
`https://$SITE_ADDRESS/mcp` as an MCP server with that token.

## 6. Hand-over

Record in the operations log: version deployed, date, host, who deployed, backup location, where the
`.env` copy and `SECRETS_ENCRYPTION_KEY` are kept.

## 7. Acceptance checks on site

1. `curl -sI https://$SITE_ADDRESS/health` → `200`, `X-Release-Version` equals `PIP_VERSION`, body shows
   `postgres: up`, `redis: up`.
2. `https://$SITE_ADDRESS/` loads the dashboard over valid TLS.
3. Run the UAT sections in `docs/uat/UAT.md` that apply to this release.

## 8. Upgrade

1. Backup first (§10). Note the backup file name.
2. Note the running version (`X-Release-Version`) — the rollback target.
3. Read the release's **Deployment** section in `CHANGELOG.md` and do what it says.
4. Set `PIP_VERSION=vX.Y.Z` in `/opt/pip/prod/.env`; refresh infra files if they changed:
   `git -C ../src fetch --depth 1 origin tag vX.Y.Z && git -C ../src checkout vX.Y.Z && cp ../src/infra/caddy/Caddyfile ../caddy/ && cp ../src/infra/prod/stack.yml .`
5. `docker compose -f stack.yml pull && docker compose -f stack.yml up -d --wait`
6. Run migrations if the changelog says so; repeat §7 checks 1–2.

On failure: `RELEASE.md` §4 Rollback.

## 9. Secret rotation

| Secret | How |
|---|---|
| `POSTGRES_PASSWORD` | `docker compose exec postgres psql -U pip -c "ALTER USER pip PASSWORD '<new>'"`, update `.env`, `up -d` |
| `SESSION_SECRET` | change in `.env`, `up -d api` — all users are signed out |
| `SECRETS_ENCRYPTION_KEY` | add the new key as current and keep the old as previous; run the re-encryption command (T-027); then remove the old key |
| `GITHUB_WEBHOOK_SECRET` | set new value in the App settings and `.env` at the same time, `up -d api`; redeliver failed deliveries |
| GitHub App private key | generate a new key in the App settings, update `.env`, `up -d api worker`, delete the old key in GitHub |
| API / integration tokens | users and admins revoke and recreate them in the dashboard |

## 10. Backup

Nightly logical backup (cron on the host; restore drill in T-114):

```sh
# /etc/cron.d/pip-backup
15 2 * * * <deploy-user> cd /opt/pip/prod && docker compose -f stack.yml exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -Fc "$POSTGRES_DB"' > ../backup/pip-$(date +\%F).dump && find ../backup -name 'pip-*.dump' -mtime +14 -delete
```

Copy `/opt/pip/backup/` off the host daily (provider snapshot or `rsync` to another machine).
Restore:

```sh
docker compose -f stack.yml stop api worker mcp web
docker compose -f stack.yml exec -T postgres sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists' < ../backup/pip-YYYY-MM-DD.dump
docker compose -f stack.yml up -d --wait
```

Redis holds only queues (NFR-2); it is not backed up. After a restore, the recovery job re-enqueues stored
events without a sync result (T-055).

## 11. Log archive

Container logs rotate at 20 MB × 5 files per service (`stack.yml`). For longer keeping, a daily cron:
`docker compose -f stack.yml logs --since 24h --no-color | gzip > ../backup/logs-$(date +%F).gz`, pruned
after 30 days.
