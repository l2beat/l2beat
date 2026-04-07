import { publicProcedure } from '../procedures'
import { router } from '../trpc'

export function createMissingTokensRouter() {
  return router({
    list: publicProcedure.query(({ ctx }) => {
      return ctx.db.interopTransfer.getMissingTokensInfo()
    }),
  })
}
