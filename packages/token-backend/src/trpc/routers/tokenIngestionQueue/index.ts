import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { TRPCError } from '@trpc/server'
import { buildInteropTransferIndex } from '../../../ingestion/InteropTransferIndex'
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
  preview: readOnlyProcedure
    .input(QueueEntryAddress)
    .mutation(async ({ ctx, input }) => {
      const transfers = await ctx.db.interopTransfer.getAll()
      const transferIndex = buildInteropTransferIndex(transfers)
      const entry = {
        chain: input.chain,
        address: input.address,
        state: 'pending' as const,
        message: null,
        createdAt: UnixTime.now(),
        updatedAt: UnixTime.now(),
      }
      return ctx.tokenIngestionProcessor.plan(entry, transferIndex)
    }),
})
