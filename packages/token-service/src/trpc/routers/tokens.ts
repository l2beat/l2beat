import { db } from '../../database/db'
import { protectedProcedure, router } from '../trpc'

export const tokensRouter = router({
  getAllAbstractTokens: protectedProcedure.query(() => {
    return db.abstractToken.getAll()
  }),
})
