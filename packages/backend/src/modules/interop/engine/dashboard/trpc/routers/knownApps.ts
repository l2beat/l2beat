import { protectedProcedure } from '../procedures'
import { router } from '../trpc'

export function createKnownAppsRouter() {
  return router({
    list: protectedProcedure.query(({ ctx }) => {
      return ctx.db.interopMessage.getUniqueAppsPerPlugin()
    }),
  })
}
