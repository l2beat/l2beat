import { protectedProcedure } from '../procedures'
import { router } from '../trpc'

export function createMissingTokensRouter() {
  return router({
    list: protectedProcedure.query(({ ctx }) => {
      return ctx.db.interopTransfer.getMissingTokensInfo()
    }),
  })
}
