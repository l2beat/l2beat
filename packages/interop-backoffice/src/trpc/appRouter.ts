import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type {
  InteropChainMetadata,
  InteropEventDetails,
  InteropEventKind,
  InteropEventStats,
  InteropMessageStats,
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
  getInteropTransferStats: () => Promise<InteropTransferStats[]>
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
