import { v } from '@l2beat/validate'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import { getInteropCoveragePiesData } from '../../impls/coveragePies'

const CoveragePiesRequest = v.object({
  collapseThresholdPct: v.number().optional(),
})

export function createCoveragePiesRouter() {
  return router({
    data: protectedProcedure
      .input(CoveragePiesRequest)
      .query(({ ctx, input }) => {
        return getInteropCoveragePiesData(ctx.db, input.collapseThresholdPct)
      }),
  })
}
