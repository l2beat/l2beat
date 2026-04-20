import { protectedProcedure } from '../procedures'
import { router } from '../trpc'

export function createFinancialsRouter() {
  return router({
    refresh: protectedProcedure.mutation(async ({ ctx }) => {
      const updatedTransfers =
        await ctx.db.interopTransfer.markAllAsUnprocessed()

      return { updatedTransfers }
    }),
  })
}
