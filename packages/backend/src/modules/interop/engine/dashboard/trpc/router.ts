import type { TokenDbClient } from '@l2beat/token-backend'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { InteropAggregationConfig } from '../../../../../config/features/interop'
import { router } from '../../../../../trpc/init'
import type { PluginSyncStatus } from '../../sync/InteropSyncersManager'
import type { ProcessorStatus } from '../impls/processors'
import { createAggregatesRouter } from './routers/aggregates'
import { createAnomaliesRouter } from './routers/anomalies'
import { createChainsRouter } from './routers/chains'
import { createCoveragePiesRouter } from './routers/coveragePies'
import { createEventsRouter } from './routers/events'
import { createFinancialsRouter } from './routers/financials'
import { createHighlightsRouter } from './routers/highlights'
import { createKnownAppsRouter } from './routers/knownApps'
import { createMessagesRouter } from './routers/messages'
import { createMissingTokensRouter } from './routers/missingTokens'
import { createStatusRouter } from './routers/status'
import { createSummaryRouter } from './routers/summary'
import { createTransfersRouter } from './routers/transfers'

export interface InteropTrpcRouterDeps {
  aggregationConfigs: InteropAggregationConfig[]
  aggregationEnabled: boolean
  captureEnabled: boolean
  getExplorerUrl: (chain: string) => string | undefined
  getChainsForPlugin: (pluginName: string) => string[]
  getPluginSyncStatuses: () => Promise<PluginSyncStatus[]>
  getProcessorStatuses: () => ProcessorStatus[]
  chains: readonly { id: string; type: 'evm' }[]
  cleanerEnabled: boolean
  compareEnabled: boolean
  configSync: {
    enabled: boolean
    chains: readonly { id: number; name: string }[]
    configIntervalMs: number
  }
  dangerousOperationsEnabled: boolean
  dashboardEnabled: boolean
  financialsEnabled: boolean
  matchingEnabled: boolean
  oneSidedChains: readonly string[]
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
    highlights: createHighlightsRouter(deps),
    messages: createMessagesRouter(),
    knownApps: createKnownAppsRouter(),
    missingTokens: createMissingTokensRouter(deps),
    summary: createSummaryRouter(deps),
    status: createStatusRouter(deps),
    transfers: createTransfersRouter(),
  })
}

export type InteropTrpcRouter = ReturnType<typeof createInteropTrpcRouter>
export type RouterOutputs = inferRouterOutputs<InteropTrpcRouter>
export type RouterInputs = inferRouterInputs<InteropTrpcRouter>
