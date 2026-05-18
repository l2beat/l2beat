import type { TokenDbClient } from '@l2beat/token-backend'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { InteropAggregationConfig } from '../../../../../config/features/interop'
import { router } from '../../../../../trpc/init'
import type { PluginSyncStatus } from '../../sync/InteropSyncersManager'
import type { ProcessorStatus } from '../impls/processors'
import { createAggregatesRouter } from './routers/aggregates'
import { createAnomaliesRouter } from './routers/anomalies'
import { createChainsRouter } from './routers/chains'
import { createConfigRouter } from './routers/config'
import { createCoveragePiesRouter } from './routers/coveragePies'
import { createEventsRouter } from './routers/events'
import { createFinancialsRouter } from './routers/financials'
import { createKnownAppsRouter } from './routers/knownApps'
import { createMessagesRouter } from './routers/messages'
import { createMissingTokensRouter } from './routers/missingTokens'
import { createStatusRouter } from './routers/status'
import { createTransfersRouter } from './routers/transfers'

export interface InteropTrpcRouterDeps {
  aggregationEnabled: boolean
  aggregationConfigs: InteropAggregationConfig[]
  captureEnabled: boolean
  getExplorerUrl: (chain: string) => string | undefined
  getChainsForPlugin: (pluginName: string) => string[]
  getPluginSyncStatuses: () => Promise<PluginSyncStatus[]>
  getProcessorStatuses: () => ProcessorStatus[]
  chains: readonly { id: string; type: 'evm' }[]
  oneSidedChains: string[]
  matchingEnabled: boolean
  cleanerEnabled: boolean
  dashboardEnabled: boolean
  compareEnabled: boolean
  dangerousOperationsEnabled: boolean
  financialsEnabled: boolean
  tokenDbApiUrl: string
  configSyncEnabled: boolean
  configChains: { id: number; name: string }[]
  configIntervalMs: number
  inMemoryEventCap: number
  tokenDbClient: TokenDbClient
}

export function createInteropTrpcRouter(deps: InteropTrpcRouterDeps) {
  return router({
    aggregates: createAggregatesRouter(deps),
    anomalies: createAnomaliesRouter(),
    chains: createChainsRouter(deps),
    config: createConfigRouter(deps),
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
