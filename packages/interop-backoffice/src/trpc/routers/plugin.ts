import type { PluginStatus } from '../embeddings'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

type Dependencies = {
  getPluginSyncStatus: () => Promise<PluginStatus[]>
}

export const createPluginRouter = (deps: Dependencies) =>
  router({
    status: publicProcedure.query(() => {
      return deps.getPluginSyncStatus()
    }),
  })
