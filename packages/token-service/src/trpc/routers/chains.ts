import { db } from '../../database/db'
import { protectedProcedure, router } from '../trpc'

export const chainsRouter = router({
  getAll: protectedProcedure.query(() => {
    return db.deployedToken.getUniqueChains()
  }),
})
