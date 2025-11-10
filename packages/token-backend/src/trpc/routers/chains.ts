import { readOnlyProcedure, router } from '../trpc'

export const chainsRouter = router({
  getAll: readOnlyProcedure.query(({ ctx }) => ctx.db.chain.getAll()),
})
