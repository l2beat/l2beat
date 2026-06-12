import type { InteropAggregationConfig } from '../../../../../../config/features/interop'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import { getInteropAggregates } from '../../impls/aggregates'

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
