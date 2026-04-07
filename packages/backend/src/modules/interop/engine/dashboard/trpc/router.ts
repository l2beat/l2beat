import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { createChainsRouter } from './routers/chains'
import { createEventsRouter } from './routers/events'
import { createKnownAppsRouter } from './routers/knownApps'
import { createMissingTokensRouter } from './routers/missingTokens'
import { createStatusRouter } from './routers/status'
import { createTransfersRouter } from './routers/transfers'
import { router } from './trpc'

export function createInteropTrpcRouter(deps: {
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return router({
    chains: createChainsRouter(deps),
    events: createEventsRouter(),
    knownApps: createKnownAppsRouter(),
    missingTokens: createMissingTokensRouter(),
    status: createStatusRouter(),
    transfers: createTransfersRouter(),
  })
}

export type InteropTrpcRouter = ReturnType<typeof createInteropTrpcRouter>
export type RouterOutputs = inferRouterOutputs<InteropTrpcRouter>
export type RouterInputs = inferRouterInputs<InteropTrpcRouter>
