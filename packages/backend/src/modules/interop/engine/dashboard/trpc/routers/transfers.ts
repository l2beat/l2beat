import { v } from '@l2beat/validate'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import {
  getInteropTransferDetails,
  getInteropTransferStats,
} from '../../impls/transfers'

const InteropTransferDetailsRequest = v.object({
  type: v.string(),
  plugin: v.string().optional(),
  srcChain: v.string().optional(),
  dstChain: v.string().optional(),
})

export function createTransfersRouter() {
  return router({
    stats: protectedProcedure.query(({ ctx }) => {
      return getInteropTransferStats(ctx.db)
    }),
    details: protectedProcedure
      .input(InteropTransferDetailsRequest)
      .query(({ ctx, input }) => {
        return getInteropTransferDetails(ctx.db, input.type, {
          plugin: input.plugin,
          srcChain: input.srcChain,
          dstChain: input.dstChain,
        })
      }),
  })
}
