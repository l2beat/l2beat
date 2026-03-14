import { v } from '@l2beat/validate'
import type {
  InteropAggregates,
  InteropAnomaliesOverview,
  InteropAnomalySeries,
  InteropCoveragePies,
  InteropEventDetails,
  InteropEventKind,
  InteropEventStats,
  InteropKnownAppsPerPlugin,
  InteropMessageDetails,
  InteropMessageStats,
  InteropMissingTokenInfo,
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
  getInteropMissingTokensInfo: () => Promise<InteropMissingTokenInfo[]>
  getInteropKnownAppsPerPlugin: () => Promise<InteropKnownAppsPerPlugin[]>
  getInteropCoveragePies: () => Promise<InteropCoveragePies>
  getInteropAggregates: () => Promise<InteropAggregates | null>
  getInteropAnomalies: () => Promise<InteropAnomaliesOverview>
  getInteropAnomalySeries: (id: string) => Promise<InteropAnomalySeries>
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

const InteropAnomalySeriesRequest = v.object({
  id: v.string(),
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
    missingTokens: publicProcedure.query(() => {
      return deps.getInteropMissingTokensInfo()
    }),
    knownApps: publicProcedure.query(() => {
      return deps.getInteropKnownAppsPerPlugin()
    }),
    coveragePies: publicProcedure.query(() => {
      return deps.getInteropCoveragePies()
    }),
    aggregates: publicProcedure.query(() => {
      return deps.getInteropAggregates()
    }),
    anomalies: publicProcedure.query(() => {
      return deps.getInteropAnomalies()
    }),
    anomalySeries: publicProcedure
      .input(InteropAnomalySeriesRequest)
      .query(({ input }) => {
        return deps.getInteropAnomalySeries(input.id)
      }),
  })
