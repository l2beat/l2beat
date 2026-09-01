import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'

export function createKnownAppsRouter() {
  return router({
    list: protectedProcedure.query(({ ctx }) => {
      return ctx.db.interopMessage.getUniqueAppsPerPlugin()
    }),
  })
}
