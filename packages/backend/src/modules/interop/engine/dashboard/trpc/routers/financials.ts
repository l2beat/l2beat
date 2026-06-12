import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'

export function createFinancialsRouter() {
  return router({
    refresh: protectedProcedure.mutation(async ({ ctx }) => {
      const updatedTransfers =
        await ctx.db.interopTransfer.markAllAsUnprocessed()

      return { updatedTransfers }
    }),
  })
}
