import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type {
  InteropEventStats,
  InteropMessageStats,
  InteropTransferStats,
  PluginStatus,
} from './embeddings'
import { helloRouter } from './routers/hello'
import { createPluginRouter } from './routers/plugin'
import { createSummaryRouter } from './routers/summary'
import { router } from './trpc'

interface AppRouterDeps {
  getPluginSyncStatus: () => Promise<PluginStatus[]>
  getInteropEventStats: () => Promise<InteropEventStats[]>
  getInteropMessageStats: () => Promise<InteropMessageStats[]>
  getInteropTransferStats: () => Promise<InteropTransferStats[]>
}

export function createAppRouter(deps: AppRouterDeps) {
  return router({
    hello: helloRouter,
    plugin: createPluginRouter(deps),
    summary: createSummaryRouter(deps),
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
