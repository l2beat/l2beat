import { v } from '@l2beat/validate'
import {
  getInteropTransferDetails,
  getInteropTransferStats,
} from '../../impls/transfers'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

const InteropTransferDetailsRequest = v.object({
  type: v.string(),
  plugin: v.string().optional(),
  srcChain: v.string().optional(),
  dstChain: v.string().optional(),
})

export function createTransfersRouter() {
  return router({
    stats: publicProcedure.query(({ ctx }) => {
      return getInteropTransferStats(ctx.db)
    }),
    details: publicProcedure
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
