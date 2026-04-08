import { getMemoryUsage } from '../../impls/memory'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

export function createStatusRouter() {
  return router({
    memory: publicProcedure.query(() => {
      return getMemoryUsage()
    }),
  })
}
