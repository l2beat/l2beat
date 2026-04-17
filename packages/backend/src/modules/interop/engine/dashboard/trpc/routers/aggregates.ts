import type { InteropAggregationConfig } from '../../../../../../config/features/interop'
import { getInteropAggregates } from '../../impls/aggregates'
import { protectedProcedure } from '../procedures'
import { router } from '../trpc'

type Dependencies = {
  aggregationConfigs: InteropAggregationConfig[]
}

export function createAggregatesRouter(deps: Dependencies) {
  return router({
    latest: protectedProcedure.query(({ ctx }) => {
      return getInteropAggregates(ctx.db, deps.aggregationConfigs)
    }),
  })
}
