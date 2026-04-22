import type { TokenDbClient } from '@l2beat/token-backend'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { InteropAggregationConfig } from '../../../../../config/features/interop'
import type { PluginSyncStatus } from '../../sync/InteropSyncersManager'
import type { ProcessorStatus } from '../impls/processors'
import { createAggregatesRouter } from './routers/aggregates'
import { createAnomaliesRouter } from './routers/anomalies'
import { createChainsRouter } from './routers/chains'
import { createCoveragePiesRouter } from './routers/coveragePies'
import { createEventsRouter } from './routers/events'
import { createFinancialsRouter } from './routers/financials'
import { createKnownAppsRouter } from './routers/knownApps'
import { createMessagesRouter } from './routers/messages'
import { createMissingTokensRouter } from './routers/missingTokens'
import { createStatusRouter } from './routers/status'
import { createTransfersRouter } from './routers/transfers'
import { router } from './trpc'

export interface InteropTrpcRouterDeps {
  aggregationConfigs: InteropAggregationConfig[]
  getExplorerUrl: (chain: string) => string | undefined
  getChainsForPlugin: (pluginName: string) => string[]
  getPluginSyncStatuses: () => Promise<PluginSyncStatus[]>
  getProcessorStatuses: () => ProcessorStatus[]
  chains: readonly { id: string; type: 'evm' }[]
  tokenDbClient: TokenDbClient
}

export function createInteropTrpcRouter(deps: InteropTrpcRouterDeps) {
  return router({
    aggregates: createAggregatesRouter(deps),
    anomalies: createAnomaliesRouter(),
    chains: createChainsRouter(deps),
    coveragePies: createCoveragePiesRouter(),
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
