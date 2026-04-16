import type { TokenDbClient } from '@l2beat/token-backend'
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

export interface InteropTrpcRouterDeps {
  getExplorerUrl: (chain: string) => string | undefined
  getChainsForPlugin: (pluginName: string) => string[]
  getPluginSyncStatuses: () => Promise<PluginSyncStatus[]>
  getProcessorStatuses: () => ProcessorStatus[]
  chains: readonly { id: string; type: 'evm' }[]
  tokenDbClient: TokenDbClient
}

export function createInteropTrpcRouter(deps: InteropTrpcRouterDeps) {
  return router({
    anomalies: createAnomaliesRouter(),
    chains: createChainsRouter(deps),
    events: createEventsRouter(),
    financials: createFinancialsRouter(),
    messages: createMessagesRouter(),
    knownApps: createKnownAppsRouter(),
    missingTokens: createMissingTokensRouter(deps),
    status: createStatusRouter(deps),
    transfers: createTransfersRouter(),
  })
}

export type InteropTrpcRouter = ReturnType<typeof createInteropTrpcRouter>
export type RouterOutputs = inferRouterOutputs<InteropTrpcRouter>
export type RouterInputs = inferRouterInputs<InteropTrpcRouter>
