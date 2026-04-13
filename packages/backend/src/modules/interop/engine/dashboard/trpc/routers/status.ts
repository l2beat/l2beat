import { getMemoryUsage } from '../../impls/memory'
import { protectedProcedure } from '../procedures'
import { router } from '../trpc'

export function createStatusRouter() {
  return router({
    memory: protectedProcedure.query(() => {
      return getMemoryUsage()
    }),
  })
}
