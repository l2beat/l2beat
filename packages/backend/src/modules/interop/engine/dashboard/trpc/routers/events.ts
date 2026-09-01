import { v } from '@l2beat/validate'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import {
  getInteropEventDetails,
  type InteropEventKind,
} from '../../impls/events'

const InteropEventDetailsRequest = v.object({
  kind: v.enum(['all', 'matched', 'unmatched', 'old-unmatched', 'unsupported']),
  type: v.string(),
})

export function createEventsRouter() {
  return router({
    stats: protectedProcedure.query(({ ctx }) => {
      return ctx.db.interopEvent.getStats()
    }),
    details: protectedProcedure
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
