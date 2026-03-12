import { v } from '@l2beat/validate'
import type {
  InteropEventDetails,
  InteropEventKind,
  InteropEventStats,
  InteropMessageStats,
  InteropTransferStats,
} from '../embeddings'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

type Dependencies = {
  getInteropEventStats: () => Promise<InteropEventStats[]>
  getInteropEventDetails: (
    kind: InteropEventKind,
    type: string,
  ) => Promise<InteropEventDetails[]>
  getInteropMessageStats: () => Promise<InteropMessageStats[]>
  getInteropTransferStats: () => Promise<InteropTransferStats[]>
}

const InteropEventDetailsRequest = v.object({
  kind: v.enum(['all', 'matched', 'unmatched', 'old-unmatched', 'unsupported']),
  type: v.string(),
})

export const createSummaryRouter = (deps: Dependencies) =>
  router({
    events: publicProcedure.query(() => {
      return deps.getInteropEventStats()
    }),
    eventsDetails: publicProcedure
      .input(InteropEventDetailsRequest)
      .query(({ input }) => {
        return deps.getInteropEventDetails(input.kind, input.type)
      }),
    messages: publicProcedure.query(() => {
      return deps.getInteropMessageStats()
    }),
    transfers: publicProcedure.query(() => {
      return deps.getInteropTransferStats()
    }),
  })
