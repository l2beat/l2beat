import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { TRPCError } from '@trpc/server'
import type { IngestionOutcome } from '../../../ingestion/IngestionTrace'
import { buildInteropTransferIndex } from '../../../ingestion/InteropTransferIndex'
import { readOnlyProcedure, readWriteProcedure } from '../../procedures'
import { router } from '../../trpc'

const QueueEntryAddress = v.object({
  chain: v.string(),
  address: v.string(),
})

const QueuePageInput = v.object({
  page: v.number(),
  pageSize: v.number(),
})

export const tokenIngestionQueueRouter = router({
  getAll: readOnlyProcedure.query(({ ctx }) => {
    return ctx.tokenDb.tokenIngestionQueue.getAll()
  }),
  getPage: readOnlyProcedure
    .input(QueuePageInput)
    .query(async ({ ctx, input }) => {
      const page = Math.max(1, Math.floor(input.page))
      const pageSize = Math.min(500, Math.max(1, Math.floor(input.pageSize)))

      const result = await ctx.tokenDb.tokenIngestionQueue.getPage({
        offset: (page - 1) * pageSize,
        limit: pageSize,
      })

      const transfers = await ctx.db.interopTransfer.getAll()
      const transferIndex = buildInteropTransferIndex(transfers)
      const predictedOutcomes: IngestionOutcome[] = []
      for (const entry of result.entries) {
        const trace = await ctx.tokenIngestionProcessor.plan(
          entry,
          transferIndex,
        )
        predictedOutcomes.push(trace.outcome)
      }

      return { ...result, predictedOutcomes }
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
      const planned = await ctx.tokenIngestionProcessor.plan(
        entry,
        transferIndex,
      )
      return ctx.tokenIngestionProcessor.fetch(planned)
    }),
})
