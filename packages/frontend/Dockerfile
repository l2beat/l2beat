# syntax=docker/dockerfile:1
ARG TURBO_TEAM
ARG COREPACK_VERSION="^0.31.0"

FROM node:22.22.0 AS pruner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PNPM_HOME:$PATH"
ARG TURBO_TEAM
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY . .
RUN pnpm add -g turbo
RUN turbo prune --docker @l2beat/frontend

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
  pnpm build:frontend

# Replace node_modules with production dependencies only. Switching dev -> prod
# in place does not garbage-collect the virtual store, so purge and reinstall
# offline from the local store (cached native builds are reused).
RUN rm -rf node_modules packages/*/node_modules && \
  CI=true pnpm install --prod --frozen-lockfile --offline

FROM node:22.22.0-slim AS release

# Install curl for healthcheck and create non-root user
RUN apt update && \
  apt install -y curl && \
  apt clean && \
  rm -rf /var/lib/apt/lists/* && \
  groupadd -r appgroup && useradd -r -g appgroup -m appuser

WORKDIR /app/
COPY --from=builder --chown=appuser:appgroup /src/ .
WORKDIR /app/packages/frontend/

USER appuser

CMD ["node", "./dist/server/index.js"]
