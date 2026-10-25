import { v } from '@l2beat/validate'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import { readOnlyProcedure } from '../../procedures'
import { router } from '../../trpc'
import { getSupplyEstimates, SUPPLY_ESTIMATE_LIMIT } from './getSupplyEstimates'
import { getTvsCoverageData } from './getTvsCoverageData'

const WindowDays = v.union([v.literal(7), v.literal(30), v.literal(90)])
const SupplyEstimateRequests = v
  .array(v.object({ chain: v.string(), address: v.string() }))
  .check(
    (requests) => requests.length <= SUPPLY_ESTIMATE_LIMIT,
    `Expected at most ${SUPPLY_ESTIMATE_LIMIT} tokens`,
  )

export function tvsCoverageRouter({
  coingeckoClient,
}: {
  coingeckoClient: CoingeckoClient
}) {
  return router({
    get: readOnlyProcedure
      .input(v.object({ days: WindowDays }))
      .query(({ ctx, input }) =>
        getTvsCoverageData(ctx.db, ctx.tokenDb, input.days),
      ),
    getSupplyEstimates: readOnlyProcedure
      .input(SupplyEstimateRequests)
      .query(({ ctx, input }) =>
        getSupplyEstimates(ctx.db, ctx.tokenDb, input, {
          getCoinsMarketData: (ids) => coingeckoClient.getCoinsMarketData(ids),
        }),
      ),
  })
}
