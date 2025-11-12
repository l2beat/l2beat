import { ChainRecord } from '../../schemas/Chain'
import { readOnlyProcedure, readWriteProcedure } from '../procedures'
import { router } from '../trpc'

export const chainsRouter = router({
  getAll: readOnlyProcedure.query(({ ctx }) => ctx.db.chain.getAll()),
  insert: readWriteProcedure
    .input(ChainRecord)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.chain.insert(input)
      return { success: true }
    }),
})
