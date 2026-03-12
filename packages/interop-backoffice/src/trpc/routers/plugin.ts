import type { PluginStatus, ProcessorStatus } from '../embeddings'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

type Dependencies = {
  getPluginSyncStatus: () => Promise<PluginStatus[]>
  getInteropProcessorStatuses: () => Promise<ProcessorStatus[]>
}

export const createPluginRouter = (deps: Dependencies) =>
  router({
    status: publicProcedure.query(() => {
      return deps.getPluginSyncStatus()
    }),
    processorStatus: publicProcedure.query(() => {
      return deps.getInteropProcessorStatuses()
    }),
  })
