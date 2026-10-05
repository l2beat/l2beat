# syntax=docker/dockerfile:1
ARG TURBO_TEAM
ARG COREPACK_VERSION="^0.36.0"

FROM node:24.21.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PNPM_HOME:$PATH"
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY package.json .
RUN corepack install

FROM base AS pruner
COPY . .
RUN pnpm add -g turbo
RUN turbo prune --docker @l2beat/token-backend

FROM base AS deps
COPY --from=pruner /src/out/json/ .
RUN pnpm install

FROM deps AS builder
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
COPY --from=pruner /src/.discovery.json .
COPY --from=pruner /src/out/full/ ./
RUN --mount=type=secret,id=TURBO_TOKEN,env=TURBO_TOKEN \
  --mount=type=secret,id=TURBO_API,env=TURBO_API \
  pnpm build:token-backend

# Replace node_modules with production dependencies only, in parallel with the
# build. Switching dev -> prod in place does not garbage-collect the virtual
# store, so purge and reinstall offline from the local store (cached native
# builds are reused).
FROM deps AS proddeps
RUN rm -rf node_modules packages/*/node_modules && \
  CI=true pnpm install --prod --frozen-lockfile --offline

FROM node:24.21.0-slim AS release

# Install curl for healthcheck and create non-root user
RUN apt update && \
  apt install -y curl && \
  apt clean && \
  rm -rf /var/lib/apt/lists/* && \
  groupadd -r appgroup && useradd -r -g appgroup -m appuser

WORKDIR /app/
# proddeps has no sources, so pnpm leaves empty placeholders for workspace bins
# (e.g. packages/discovery/cli.js). Copy builder last so the real files win.
COPY --from=proddeps --chown=appuser:appgroup /src/ .
COPY --from=builder --chown=appuser:appgroup --exclude=**/node_modules /src/ .

WORKDIR /app/packages/token-backend/
USER appuser

CMD ["node", "build/server.js"]
