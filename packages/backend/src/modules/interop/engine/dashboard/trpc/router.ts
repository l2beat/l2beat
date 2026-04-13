import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { PluginSyncStatus } from '../../sync/InteropSyncersManager'
import type { ProcessorStatus } from '../impls/processors'
import { createAnomaliesRouter } from './routers/anomalies'
import { createChainsRouter } from './routers/chains'
import { createEventsRouter } from './routers/events'
import { createFinancialsRouter } from './routers/financials'
import { createKnownAppsRouter } from './routers/knownApps'
import { createMessagesRouter } from './routers/messages'
import { createMissingTokensRouter } from './routers/missingTokens'
import { createStatusRouter } from './routers/status'
import { createTransfersRouter } from './routers/transfers'
import { router } from './trpc'

export function createInteropTrpcRouter(deps: {
  getExplorerUrl: (chain: string) => string | undefined
  getChainsForPlugin: (pluginName: string) => string[]
  getPluginSyncStatuses: () => Promise<PluginSyncStatus[]>
  getProcessorStatuses: () => ProcessorStatus[]
}) {
  return router({
    anomalies: createAnomaliesRouter(),
    chains: createChainsRouter(deps),
    events: createEventsRouter(),
    financials: createFinancialsRouter(),
    messages: createMessagesRouter(),
    knownApps: createKnownAppsRouter(),
    missingTokens: createMissingTokensRouter(),
    status: createStatusRouter(deps),
    transfers: createTransfersRouter(),
  })
}

export type InteropTrpcRouter = ReturnType<typeof createInteropTrpcRouter>
export type RouterOutputs = inferRouterOutputs<InteropTrpcRouter>
export type RouterInputs = inferRouterInputs<InteropTrpcRouter>
