import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import { getInteropCoveragePiesData } from '../../impls/coveragePies'

export function createCoveragePiesRouter() {
  return router({
    data: protectedProcedure.query(({ ctx }) => {
      return getInteropCoveragePiesData(ctx.db)
    }),
  })
}
