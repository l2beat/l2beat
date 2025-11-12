import { readOnlyProcedure } from '../procedures'
import { router } from '../trpc'

export const chainsRouter = router({
  getAll: readOnlyProcedure.query(({ ctx }) => ctx.db.chain.getAll()),
})
