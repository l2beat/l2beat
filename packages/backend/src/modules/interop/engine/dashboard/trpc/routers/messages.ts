import { v } from '@l2beat/validate'
import {
  getInteropMessageDetails,
  getInteropMessageStats,
} from '../../impls/messages'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

const InteropMessageDetailsRequest = v.object({
  type: v.string(),
  plugin: v.string().optional(),
  srcChain: v.string().optional(),
  dstChain: v.string().optional(),
})

export function createMessagesRouter() {
  return router({
    stats: publicProcedure.query(({ ctx }) => {
      return getInteropMessageStats(ctx.db)
    }),
    details: publicProcedure
      .input(InteropMessageDetailsRequest)
      .query(({ ctx, input }) => {
        return getInteropMessageDetails(ctx.db, input.type, {
          plugin: input.plugin,
          srcChain: input.srcChain,
          dstChain: input.dstChain,
        })
      }),
  })
}
