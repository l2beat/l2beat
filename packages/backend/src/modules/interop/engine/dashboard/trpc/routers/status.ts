import { getMemoryUsage } from '../../impls/memory'
import type { ProcessorStatus } from '../../impls/processors'
import { protectedProcedure } from '../procedures'
import { router } from '../trpc'

type Dependencies = {
  getProcessorStatuses: () => ProcessorStatus[]
}

export function createStatusRouter(deps: Dependencies) {
  return router({
    memory: protectedProcedure.query(() => {
      return getMemoryUsage()
    }),
    processors: protectedProcedure.query(() => {
      return deps.getProcessorStatuses()
    }),
  })
}
