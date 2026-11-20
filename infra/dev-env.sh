#!/bin/sh
# Writes infra/.env from .env.example, replacing every `change-me` with a random secret.
# Never overwrites an existing infra/.env.
set -eu
cd "$(dirname "$0")/.."
target=infra/.env
if [ -f "$target" ]; then
  echo "$target exists; leaving it untouched."
  exit 0
fi
umask 077
pw=$(openssl rand -hex 24)
: > "$target"
while IFS= read -r line; do
  case "$line" in
    POSTGRES_PASSWORD=*) echo "POSTGRES_PASSWORD=$pw" ;;
    DATABASE_URL=*) echo "DATABASE_URL=postgres://pip:$pw@localhost:15432/pip" ;;
    *=change-me) echo "${line%=change-me}=$(openssl rand -hex 32)" ;;
    *) echo "$line" ;;
  esac
done < .env.example >> "$target"
echo "wrote $target (mode 600)"
