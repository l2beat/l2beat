# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv
ARG ARCH=x86_64
ARG TURBO_TEAM
ARG COREPACK_VERSION="^0.36.0"

FROM node:22.22.0 AS pruner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PNPM_HOME:$PATH"
ARG TURBO_TEAM
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY . .
RUN pnpm add -g turbo
RUN turbo prune --docker @l2beat/token-backend

FROM node:22.22.0 AS builder
ARG ARCH
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY --from=pruner /src/out/json/ .
# The store lives in a cache mount so a lockfile change only downloads the
# packages that actually changed instead of the whole dependency tree.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --store-dir /pnpm/store
COPY --from=pruner /src/.discovery.json .
COPY --from=pruner /src/out/full/ ./
# Coolify cannot pass build secrets, only build args, so accept the turbo
# credentials both ways. The secret mounts below take precedence when present.
ARG TURBO_TOKEN
ARG TURBO_API
# Secrets are read from files rather than mounted as env, because an absent
# secret mounted with env= blanks the variable and overrides the build arg.
RUN --mount=type=secret,id=TURBO_TOKEN \
  --mount=type=secret,id=TURBO_API \
  export TURBO_TOKEN="$(cat /run/secrets/TURBO_TOKEN 2>/dev/null || echo "$TURBO_TOKEN")" && \
  export TURBO_API="$(cat /run/secrets/TURBO_API 2>/dev/null || echo "$TURBO_API")" && \
  pnpm build:token-backend

# Replace node_modules with production dependencies only. Switching dev -> prod
# in place does not garbage-collect the virtual store, so purge and reinstall
# from the store. Not --offline: pnpm occasionally misses a store snapshot it
# just wrote and would fail the build instead of fetching the one package.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  rm -rf node_modules packages/*/node_modules && \
  CI=true pnpm install --prod --frozen-lockfile --store-dir /pnpm/store

RUN mkdir /dist/ && \
  cd /dist/ && \
  wget -q https://github.com/Wilfred/difftastic/releases/download/0.57.0/difft-$ARCH-unknown-linux-gnu.tar.gz && \
  tar -xf difft-$ARCH-unknown-linux-gnu.tar.gz && \
  rm -f difft-$ARCH-unknown-linux-gnu.tar.gz


FROM node:22.22.0-slim AS release

# Install curl for healthcheck and create non-root user
RUN apt update && \
  apt install -y curl && \
  apt clean && \
  rm -rf /var/lib/apt/lists/* && \
  groupadd -r appgroup && useradd -r -g appgroup -m appuser

WORKDIR /app/
COPY --from=builder --chown=appuser:appgroup /src/ .
COPY --from=builder --chown=appuser:appgroup /dist/difft /usr/local/bin/difft

WORKDIR /app/packages/token-backend/
USER appuser

CMD ["node", "build/server.js"]
