ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG COREPACK_VERSION="^0.31.0"

FROM node:22.22.0 AS pruner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY . .
RUN pnpm add -g turbo
RUN turbo prune --docker @l2beat/frontend

FROM node:22.22.0 AS builder
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY --from=pruner /src/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /src/.discovery.json .
COPY --from=pruner /src/out/full/ ./
RUN pnpm build:frontend

FROM node:22.22.0-slim AS release

# Security: Run as non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup -m appuser

WORKDIR /app/
COPY --from=builder --chown=appuser:appgroup /src/ .
WORKDIR /app/packages/frontend/

USER appuser

CMD node ./dist/server/index.js
