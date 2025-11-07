import { db } from '../../database/db'
import { readOnlyProcedure, router } from '../trpc'

export const chainsRouter = router({
  getAll: readOnlyProcedure.query(() => {
    return db.chain.getAll()
  }),
})
