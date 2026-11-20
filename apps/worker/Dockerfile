# syntax=docker/dockerfile:1.7
# Image pip-worker (T-110). Build from the repo root: docker build -f apps/worker/Dockerfile .
FROM node:22.21-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate
WORKDIR /repo

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile \
 && pnpm --filter "@pip/worker..." run build \
 && pnpm --filter "@pip/worker" deploy --legacy --prod /out

FROM node:22.21-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /out ./
ARG RELEASE_VERSION=0.0.0-dev
ENV RELEASE_VERSION=$RELEASE_VERSION
USER node
HEALTHCHECK --interval=15s --timeout=3s --start-period=15s --retries=3 CMD node dist/healthcheck.js
CMD ["node", "dist/index.js"]
