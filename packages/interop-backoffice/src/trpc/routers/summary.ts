import type { InteropEventStats, InteropMessageStats } from '../embeddings'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

type Dependencies = {
  getInteropEventStats: () => Promise<InteropEventStats[]>
  getInteropMessageStats: () => Promise<InteropMessageStats[]>
}

export const createSummaryRouter = (deps: Dependencies) =>
  router({
    events: publicProcedure.query(() => {
      return deps.getInteropEventStats()
    }),
    messages: publicProcedure.query(() => {
      return deps.getInteropMessageStats()
    }),
  })
