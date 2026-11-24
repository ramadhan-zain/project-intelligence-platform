#!/bin/sh
# Writes infra/.env from .env.example, replacing every `change-me` with a random secret.
# Never overwrites an existing infra/.env: keys added to .env.example since are appended, and a
# DATABASE_URL still on the owner role is moved to the app role `pip_app` (T-020). Prints no secrets.
set -eu
cd "$(dirname "$0")/.."
target=${PIP_ENV_FILE:-infra/.env}
umask 077

get() { sed -n "s/^$1=//p" "$target" | tail -n 1; }

# Value for one .env.example line; uses $pw (owner) and $apw (app role).
line_for() {
  case "$1" in
    POSTGRES_PASSWORD=*) echo "POSTGRES_PASSWORD=$pw" ;;
    APP_DB_PASSWORD=*) echo "APP_DB_PASSWORD=$apw" ;;
    DATABASE_URL=*) echo "DATABASE_URL=postgres://pip_app:$apw@localhost:15432/pip" ;;
    DATABASE_MIGRATION_URL=*) echo "DATABASE_MIGRATION_URL=postgres://pip:$pw@localhost:15432/pip" ;;
    *=change-me) echo "${1%=change-me}=$(openssl rand -hex 32)" ;;
    *) echo "$1" ;;
  esac
}

if [ ! -f "$target" ]; then
  pw=$(openssl rand -hex 24)
  apw=$(openssl rand -hex 24)
  : > "$target"
  while IFS= read -r line; do line_for "$line"; done < .env.example >> "$target"
  echo "wrote $target (mode 600)"
  exit 0
fi

pw=$(get POSTGRES_PASSWORD)
apw=$(get APP_DB_PASSWORD)
[ -n "$apw" ] || apw=$(openssl rand -hex 24)
changed=""
while IFS= read -r line; do
  case "$line" in [A-Z]*=*) ;; *) continue ;; esac
  key=${line%%=*}
  if ! grep -q "^$key=" "$target"; then
    line_for "$line" >> "$target"
    changed="$changed $key"
  fi
done < .env.example
owner_url="^DATABASE_URL=postgres://pip:"
if grep -q "$owner_url" "$target"; then
  tmp=$(mktemp "$target.XXXXXX")
  sed "s#${owner_url}[^@]*@#DATABASE_URL=postgres://pip_app:$apw@#" "$target" > "$tmp"
  mv "$tmp" "$target"
  changed="$changed DATABASE_URL(now pip_app)"
fi
if [ -n "$changed" ]; then echo "updated $target:$changed"; else echo "$target is up to date."; fi
