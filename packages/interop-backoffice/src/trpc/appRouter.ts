import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type {
  InteropAggregates,
  InteropAnomaliesOverview,
  InteropAnomalySeries,
  InteropChainMetadata,
  InteropCoveragePies,
  InteropEventDetails,
  InteropEventKind,
  InteropEventStats,
  InteropKnownAppsPerPlugin,
  InteropMessageDetails,
  InteropMessageStats,
  InteropMissingTokenInfo,
  InteropTransferDetails,
  InteropTransferStats,
  PluginStatus,
  ProcessorStatus,
} from './embeddings'
import { createChainsRouter } from './routers/chains'
import { helloRouter } from './routers/hello'
import { createPluginRouter } from './routers/plugin'
import { createSummaryRouter } from './routers/summary'
import { router } from './trpc'

interface AppRouterDeps {
  getPluginSyncStatus: () => Promise<PluginStatus[]>
  getInteropEventStats: () => Promise<InteropEventStats[]>
  getInteropEventDetails: (
    kind: InteropEventKind,
    type: string,
  ) => Promise<InteropEventDetails[]>
  getInteropMessageStats: () => Promise<InteropMessageStats[]>
  getInteropMessageDetails: (input: {
    type: string
    plugin?: string
    srcChain?: string
    dstChain?: string
  }) => Promise<InteropMessageDetails[]>
  getInteropTransferStats: () => Promise<InteropTransferStats[]>
  getInteropTransferDetails: (input: {
    type: string
    plugin?: string
    srcChain?: string
    dstChain?: string
  }) => Promise<InteropTransferDetails[]>
  getInteropProcessorStatuses: () => Promise<ProcessorStatus[]>
  requestInteropResync: (input: {
    pluginName: string
    resyncRequestedFrom: Record<string, number>
  }) => Promise<{
    updatedChains: string[]
  }>
  restartInteropPluginFromNow: (input: { pluginName: string }) => Promise<{
    updatedChains: string[]
  }>
  wipeInteropFinancials: () => Promise<{
    updatedTransfers: number
  }>
  getInteropMissingTokensInfo: () => Promise<InteropMissingTokenInfo[]>
  getInteropKnownAppsPerPlugin: () => Promise<InteropKnownAppsPerPlugin[]>
  getInteropCoveragePies: () => Promise<InteropCoveragePies>
  getInteropAggregates: () => Promise<InteropAggregates | null>
  getInteropAnomalies: () => Promise<InteropAnomaliesOverview>
  getInteropAnomalySeries: (id: string) => Promise<InteropAnomalySeries>
  getInteropChainMetadata: () => Promise<InteropChainMetadata[]>
}

export function createAppRouter(deps: AppRouterDeps) {
  return router({
    hello: helloRouter,
    chains: createChainsRouter(deps),
    plugin: createPluginRouter(deps),
    summary: createSummaryRouter(deps),
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
