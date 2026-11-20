# Operations — incident handbook

One section per failure: **symptom → check → fix**. Commands run in `/opt/pip/prod` on the production host
(`dc` = `docker compose -f stack.yml`). After any fix: `curl -sI https://$SITE_ADDRESS/health` must be `200`.

## Escalation

| Level | Who (role) | When |
|---|---|---|
| 1 | On-call developer (repository owner) | any alert or user report |
| 2 | Product owner | outage > 1 h, data loss, security issue |
| Hosting | VM provider support | host unreachable, disk / network fault |

## 1. A container is down or restarting

* **Symptom:** dashboard or MCP errors; `/health` 503 or unreachable.
* **Check:** `dc ps` (state, health); `dc logs --tail=200 <service>`.
* **Fix:** `dc up -d <service>`. Crash loop after an upgrade → `RELEASE.md` §4 Rollback. Config error
  in logs → fix `.env`, `dc up -d <service>`.

## 2. PostgreSQL down or corrupt

* **Symptom:** `/health` shows `postgres: down`; event intake answers 503 (senders retry).
* **Check:** `dc logs postgres`; disk space `df -h`; `dc exec postgres pg_isready`.
* **Fix:** disk full → free space (old backups / logs), `dc up -d postgres`. Won't start / corrupt →
  stop apps, restore the last backup (`DEPLOYMENT.md` §10), start; tell users data after the backup time is
  lost. GitHub redelivers recent webhooks on request (App → Advanced → Redeliver).

## 3. Redis / queue down

* **Symptom:** `/health` shows `redis: down`; new events stored but not processed; timeline stops updating.
* **Check:** `dc logs redis`; `dc exec redis redis-cli ping`.
* **Fix:** `dc up -d redis`, then `dc restart worker`. Unprocessed events are re-enqueued by the recovery
  job (T-055). Persistent AOF corruption → `dc exec redis redis-check-aof --fix /data/appendonly.aof`, or
  delete the Redis volume (only queued jobs are lost; events are in PostgreSQL).

## 4. Worker stuck or dead letters growing

* **Symptom:** sync results stop; dashboard data stale; dead-letter count rising (T-050 diagnostics).
* **Check:** `dc logs --tail=300 worker`; dead letters in the admin view.
* **Fix:** fix the cause (credential, schema mismatch), `dc restart worker`, replay dead letters
  (`make replay-dead-letters`, T-050).

## 5. External system down — GitHub

* **Symptom:** sync jobs failing with network / 5xx; integration health `degraded`; githubstatus.com shows an incident.
* **Check:** integration diagnostics page; `dc logs worker | grep -i github`.
* **Fix:** nothing to do during the outage — jobs retry with backoff. Afterwards, the scheduled consistency
  pull (OQ-017) or a manual full resync (T-054) reconciles; redeliver failed webhooks from the App page.

## 6. Webhooks rejected (401)

* **Symptom:** GitHub App "Recent deliveries" show 401.
* **Check:** `GITHUB_WEBHOOK_SECRET` in `.env` equals the App's webhook secret.
* **Fix:** align both (`DEPLOYMENT.md` §9), `dc up -d api`, redeliver.

## 7. TLS / proxy failure

* **Symptom:** browser certificate error or connection refused on 443.
* **Check:** `dc logs caddy` (ACME errors); DNS points at this host; ports 80 / 443 open.
* **Fix:** correct DNS / firewall, `dc restart caddy`. Caddy retries certificate issuance automatically.

## 8. Power failure or host reboot

* **Symptom:** everything unreachable, then back.
* **Check:** after boot, `dc ps` — services use `restart: unless-stopped` and come back with Docker.
* **Fix:** if not up, `dc up -d --wait`. Check `/health`; check the worker drained the backlog.

## 9. Docker engine (orchestrator) down

* **Symptom:** `docker ps` fails; all services down.
* **Check:** `systemctl status docker`; `journalctl -u docker --since -1h`; disk space.
* **Fix:** `sudo systemctl restart docker`, then `dc up -d --wait`. Disk full in `/var/lib/docker` →
  `docker system prune` (never `-a --volumes` on production).

## 10. Suspected security incident

* **Symptom:** unexpected audit-log entries, leaked token or secret.
* **Fix:** revoke affected API / integration tokens; rotate the leaked secret (`DEPLOYMENT.md` §9); review
  the audit log (FR-10.5) for the period; escalate to level 2.
