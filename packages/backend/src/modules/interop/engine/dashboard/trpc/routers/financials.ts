import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import {
  reprocessFinancialTransfersByFilter,
  searchFinancialTransfers,
} from '../../impls/financials'

const timestamp = v.number().check((value) => {
  try {
    UnixTime(value)
    return true
  } catch (error) {
    return error instanceof Error ? error.message : 'Invalid timestamp'
  }
})

const FinancialTransfersFilterRequest = v
  .object({
    transferId: v.string().optional(),
    srcChain: v.string().optional(),
    srcTokenAddress: v.string().optional(),
    srcAbstractTokenId: v.string().optional(),
    srcSymbol: v.string().optional(),
    dstChain: v.string().optional(),
    dstTokenAddress: v.string().optional(),
    dstAbstractTokenId: v.string().optional(),
    dstSymbol: v.string().optional(),
    from: timestamp.optional(),
    to: timestamp.optional(),
  })
  .check(
    (input) =>
      input.from === undefined ||
      input.to === undefined ||
      input.from <= input.to,
    'from must not be after to',
  )

export function createFinancialsRouter() {
  return router({
    transfers: protectedProcedure
      .input(FinancialTransfersFilterRequest)
      .query(({ ctx, input }) => {
        return searchFinancialTransfers(ctx.db, input)
      }),
    reprocess: protectedProcedure
      .input(FinancialTransfersFilterRequest)
      .mutation(({ ctx, input }) => {
        return reprocessFinancialTransfersByFilter(ctx.db, input)
      }),
    refresh: protectedProcedure.mutation(async ({ ctx }) => {
      const updatedTransfers =
        await ctx.db.interopTransfer.markAllAsUnprocessed()

      return { updatedTransfers }
    }),
  })
}
