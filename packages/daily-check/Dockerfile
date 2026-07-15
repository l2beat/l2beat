# syntax=docker/dockerfile:1
ARG TURBO_TEAM
ARG COREPACK_VERSION="^0.31.0"

FROM node:22.22.0 AS pruner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG TURBO_TEAM
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY . .
RUN pnpm add -g turbo
RUN turbo prune --docker @l2beat/daily-check

FROM node:22.22.0 AS builder
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY --from=pruner /src/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /src/.discovery.json .
COPY --from=pruner /src/out/full/ ./
RUN --mount=type=secret,id=TURBO_TOKEN,env=TURBO_TOKEN \
  --mount=type=secret,id=TURBO_API,env=TURBO_API \
  pnpm build:daily-check

FROM node:22.22.0-slim AS release

# Install curl for healthcheck, Claude Code for the AI investigation,
# and create non-root user
RUN apt update && \
  apt install -y curl && \
  apt clean && \
  rm -rf /var/lib/apt/lists/* && \
  npm i -g @anthropic-ai/claude-code && \
  groupadd -r appgroup && useradd -r -g appgroup -m appuser

WORKDIR /app/
COPY --from=builder --chown=appuser:appgroup /src/ .
WORKDIR /app/packages/daily-check/

USER appuser

ENV NODE_ENV=production
CMD ["node", "./build/index.js"]
