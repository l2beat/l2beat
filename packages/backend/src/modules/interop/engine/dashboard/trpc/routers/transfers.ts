import { v } from '@l2beat/validate'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import {
  getInteropTransferDetails,
  getInteropTransferStats,
} from '../../impls/transfers'
import {
  InteropTransferDataRange,
  InteropTransferDataRangeRequest,
  resolveInteropTransferTimeRange,
} from '../transferDataRange'

const InteropTransferDetailsRequest = v.object({
  type: v.string(),
  plugin: v.string().optional(),
  srcChain: v.string().optional(),
  dstChain: v.string().optional(),
  range: InteropTransferDataRange.optional(),
})

export function createTransfersRouter() {
  return router({
    stats: protectedProcedure
      .input(InteropTransferDataRangeRequest)
      .query(async ({ ctx, input }) =>
        getInteropTransferStats(
          ctx.db,
          await resolveInteropTransferTimeRange(ctx.db, input?.range),
        ),
      ),
    details: protectedProcedure
      .input(InteropTransferDetailsRequest)
      .query(async ({ ctx, input }) => {
        return getInteropTransferDetails(ctx.db, input.type, {
          plugin: input.plugin,
          srcChain: input.srcChain,
          dstChain: input.dstChain,
          timeRange: await resolveInteropTransferTimeRange(ctx.db, input.range),
        })
      }),
  })
}
