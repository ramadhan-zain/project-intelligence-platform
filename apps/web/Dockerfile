# syntax=docker/dockerfile:1.7
# Image pip-web (T-110). Build from the repo root: docker build -f apps/web/Dockerfile .
FROM node:22.21-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate
WORKDIR /repo

FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile && pnpm --filter "@pip/web..." run build

FROM node:22.21-alpine AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /repo/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/web/.next/static ./apps/web/.next/static
ARG RELEASE_VERSION=0.0.0-dev
ENV RELEASE_VERSION=$RELEASE_VERSION
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=20s --retries=3 CMD wget -qO- http://127.0.0.1:3000/health >/dev/null || exit 1
CMD ["node", "apps/web/server.js"]
