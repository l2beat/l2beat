import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { PluginStatus } from './embeddings'
import { helloRouter } from './routers/hello'
import { createPluginRouter } from './routers/plugin'
import { router } from './trpc'

interface AppRouterDeps {
  getPluginSyncStatus: () => Promise<PluginStatus[]>
}

export function createAppRouter(deps: AppRouterDeps) {
  return router({
    hello: helloRouter,
    plugin: createPluginRouter(deps),
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
