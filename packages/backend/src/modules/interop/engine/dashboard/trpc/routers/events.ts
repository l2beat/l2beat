import { v } from '@l2beat/validate'
import {
  getInteropEventDetails,
  type InteropEventKind,
} from '../../impls/events'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

const InteropEventDetailsRequest = v.object({
  kind: v.enum(['all', 'matched', 'unmatched', 'old-unmatched', 'unsupported']),
  type: v.string(),
})

export function createEventsRouter() {
  return router({
    stats: publicProcedure.query(({ ctx }) => {
      return ctx.db.interopEvent.getStats()
    }),
    details: publicProcedure
      .input(InteropEventDetailsRequest)
      .query(({ ctx, input }) => {
        return getInteropEventDetails(
          ctx.db,
          input.kind as InteropEventKind,
          input.type,
        )
      }),
  })
}
