import { publicProcedure } from '../procedures'
import { router } from '../trpc'

export function createKnownAppsRouter() {
  return router({
    list: publicProcedure.query(({ ctx }) => {
      return ctx.db.interopMessage.getUniqueAppsPerPlugin()
    }),
  })
}
