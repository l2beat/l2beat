import { v } from '@l2beat/validate'
import { TRPCError } from '@trpc/server'
import { readOnlyProcedure, readWriteProcedure } from '../../procedures'
import { router } from '../../trpc'

const QueueEntryAddress = v.object({
  chain: v.string(),
  address: v.string(),
})

export const tokenIngestionQueueRouter = router({
  getAll: readOnlyProcedure.query(({ ctx }) => {
    return ctx.tokenDb.tokenIngestionQueue.getAll()
  }),
  approve: readWriteProcedure
    .input(QueueEntryAddress)
    .mutation(async ({ ctx, input }) => {
      const approved = await ctx.tokenDb.tokenIngestionQueue.approve(input)
      if (approved !== 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Queue entry is not staged',
        })
      }

      return { success: true }
    }),
})
