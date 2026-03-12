import type { InteropEventStats } from '../embeddings'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

type Dependencies = {
  getInteropEventStats: () => Promise<InteropEventStats[]>
}

export const createSummaryRouter = (deps: Dependencies) =>
  router({
    events: publicProcedure.query(() => {
      return deps.getInteropEventStats()
    }),
  })
