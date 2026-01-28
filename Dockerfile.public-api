ARG ARCH=x86_64
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG COREPACK_VERSION="^0.31.0"

FROM node:22.22.0 as pruner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY . .
RUN pnpm add -g turbo
RUN turbo prune --docker @l2beat/public-api

FROM node:22.22.0 as builder
ARG ARCH
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY --from=pruner /src/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /src/.discovery.json .
COPY --from=pruner /src/out/full/ ./
RUN pnpm build:public-api

RUN mkdir /dist/ && \
  cd /dist/ && \
  wget -q https://github.com/Wilfred/difftastic/releases/download/0.57.0/difft-$ARCH-unknown-linux-gnu.tar.gz && \
  tar -xf difft-$ARCH-unknown-linux-gnu.tar.gz && \
  rm -f difft-$ARCH-unknown-linux-gnu.tar.gz


FROM node:22.22.0-slim as release

# Security: Run as non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup -m appuser

WORKDIR /app/
COPY --from=builder --chown=appuser:appgroup /src/ .
COPY --from=builder --chown=appuser:appgroup /dist/difft /usr/local/bin/difft

USER appuser

CMD cd packages/public-api && node build/index.js
