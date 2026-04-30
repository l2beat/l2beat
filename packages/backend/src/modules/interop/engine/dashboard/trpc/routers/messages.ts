import { v } from '@l2beat/validate'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import {
  getInteropMessageDetails,
  getInteropMessageStats,
} from '../../impls/messages'

const InteropMessageDetailsRequest = v.object({
  type: v.string(),
  plugin: v.string().optional(),
  srcChain: v.string().optional(),
  dstChain: v.string().optional(),
})

export function createMessagesRouter() {
  return router({
    stats: protectedProcedure.query(({ ctx }) => {
      return getInteropMessageStats(ctx.db)
    }),
    details: protectedProcedure
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
