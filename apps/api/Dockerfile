# syntax=docker/dockerfile:1.7
# Image pip-api (T-110). Build from the repo root: docker build -f apps/api/Dockerfile .
FROM node:22.21-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate
WORKDIR /repo

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile \
 && pnpm --filter "@pip/api..." run build \
 && pnpm --filter "@pip/api" deploy --legacy --prod /out

FROM node:22.21-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /out ./
ARG RELEASE_VERSION=0.0.0-dev
ENV RELEASE_VERSION=$RELEASE_VERSION
USER node
EXPOSE 3001
HEALTHCHECK --interval=15s --timeout=3s --start-period=15s --retries=3 CMD wget -qO- http://127.0.0.1:3001/health >/dev/null || exit 1
CMD ["node", "dist/index.js"]
