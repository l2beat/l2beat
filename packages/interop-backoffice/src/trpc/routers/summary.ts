import type {
  InteropEventStats,
  InteropMessageStats,
  InteropTransferStats,
} from '../embeddings'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

type Dependencies = {
  getInteropEventStats: () => Promise<InteropEventStats[]>
  getInteropMessageStats: () => Promise<InteropMessageStats[]>
  getInteropTransferStats: () => Promise<InteropTransferStats[]>
}

export const createSummaryRouter = (deps: Dependencies) =>
  router({
    events: publicProcedure.query(() => {
      return deps.getInteropEventStats()
    }),
    messages: publicProcedure.query(() => {
      return deps.getInteropMessageStats()
    }),
    transfers: publicProcedure.query(() => {
      return deps.getInteropTransferStats()
    }),
  })
