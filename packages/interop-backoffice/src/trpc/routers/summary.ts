import { v } from '@l2beat/validate'
import type {
  InteropEventDetails,
  InteropEventKind,
  InteropEventStats,
  InteropMessageDetails,
  InteropMessageStats,
  InteropTransferDetails,
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
  getInteropMessageDetails: (input: {
    type: string
    plugin?: string
    srcChain?: string
    dstChain?: string
  }) => Promise<InteropMessageDetails[]>
  getInteropTransferStats: () => Promise<InteropTransferStats[]>
  getInteropTransferDetails: (input: {
    type: string
    plugin?: string
    srcChain?: string
    dstChain?: string
  }) => Promise<InteropTransferDetails[]>
}

const InteropEventDetailsRequest = v.object({
  kind: v.enum(['all', 'matched', 'unmatched', 'old-unmatched', 'unsupported']),
  type: v.string(),
})

const InteropMessageDetailsRequest = v.object({
  type: v.string(),
  plugin: v.string().optional(),
  srcChain: v.string().optional(),
  dstChain: v.string().optional(),
})

const InteropTransferDetailsRequest = v.object({
  type: v.string(),
  plugin: v.string().optional(),
  srcChain: v.string().optional(),
  dstChain: v.string().optional(),
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
    messagesDetails: publicProcedure
      .input(InteropMessageDetailsRequest)
      .query(({ input }) => {
        return deps.getInteropMessageDetails(input)
      }),
    transfers: publicProcedure.query(() => {
      return deps.getInteropTransferStats()
    }),
    transfersDetails: publicProcedure
      .input(InteropTransferDetailsRequest)
      .query(({ input }) => {
        return deps.getInteropTransferDetails(input)
      }),
  })
