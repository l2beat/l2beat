ARG ARCH=x86_64
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG COREPACK_VERSION="^0.31.0"

FROM node:22 AS pruner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY . .
RUN pnpm add -g turbo
RUN turbo prune --docker @l2beat/l2b

FROM node:22 AS builder
EXPOSE 3000
ARG ARCH
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG COREPACK_VERSION
RUN npm i -g corepack@${COREPACK_VERSION} && corepack enable pnpm
WORKDIR /src/
COPY --from=pruner /src/out/json/ .
RUN pnpm install
COPY --from=pruner /src/.discovery.json .
COPY --from=pruner /src/out/full/ ./
# build config 
RUN VITE_READONLY=true pnpm build


FROM node:22-slim AS release
WORKDIR /app/
COPY --from=builder /src/ .
RUN cd packages/l2b && npm install -g 
CMD cd packages/l2b && l2b ui --readonly
