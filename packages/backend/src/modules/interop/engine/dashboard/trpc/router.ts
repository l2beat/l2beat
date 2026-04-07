import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { createAnomaliesRouter } from './routers/anomalies'
import { createChainsRouter } from './routers/chains'
import { createEventsRouter } from './routers/events'
import { createKnownAppsRouter } from './routers/knownApps'
import { createMessagesRouter } from './routers/messages'
import { createMissingTokensRouter } from './routers/missingTokens'
import { createStatusRouter } from './routers/status'
import { createTransfersRouter } from './routers/transfers'
import { router } from './trpc'

export function createInteropTrpcRouter(deps: {
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return router({
    anomalies: createAnomaliesRouter(),
    chains: createChainsRouter(deps),
    events: createEventsRouter(),
    messages: createMessagesRouter(),
    knownApps: createKnownAppsRouter(),
    missingTokens: createMissingTokensRouter(),
    status: createStatusRouter(),
    transfers: createTransfersRouter(),
  })
}

export type InteropTrpcRouter = ReturnType<typeof createInteropTrpcRouter>
export type RouterOutputs = inferRouterOutputs<InteropTrpcRouter>
export type RouterInputs = inferRouterInputs<InteropTrpcRouter>
