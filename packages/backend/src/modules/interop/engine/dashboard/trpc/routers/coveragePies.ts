import { getInteropCoveragePiesData } from '../../impls/coveragePies'
import { protectedProcedure } from '../procedures'
import { router } from '../trpc'

export function createCoveragePiesRouter() {
  return router({
    data: protectedProcedure.query(({ ctx }) => {
      return getInteropCoveragePiesData(ctx.db)
    }),
  })
}
