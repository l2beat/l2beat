import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type {
  InteropChainMetadata,
  InteropEventDetails,
  InteropEventKind,
  InteropEventStats,
  InteropKnownAppsPerPlugin,
  InteropMissingTokenInfo,
  InteropMessageDetails,
  InteropMessageStats,
  InteropTransferDetails,
  InteropTransferStats,
  PluginStatus,
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
  getInteropMissingTokensInfo: () => Promise<InteropMissingTokenInfo[]>
  getInteropKnownAppsPerPlugin: () => Promise<InteropKnownAppsPerPlugin[]>
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
