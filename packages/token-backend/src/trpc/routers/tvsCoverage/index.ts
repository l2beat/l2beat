import { v } from '@l2beat/validate'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import { readOnlyProcedure } from '../../procedures'
import { router } from '../../trpc'
import {
  getSupplyChangeEvidence,
  SUPPLY_CHANGE_EVIDENCE_LIMIT,
} from './getSupplyChangeEvidence'
import { getSupplyEstimates, SUPPLY_ESTIMATE_LIMIT } from './getSupplyEstimates'
import { getTvsCoverageData } from './getTvsCoverageData'

const WindowHours = v.union([v.literal(24), v.literal(72), v.literal(168)])
const SupplyEstimateRequests = v
  .array(v.object({ chain: v.string(), address: v.string() }))
  .check(
    (requests) => requests.length <= SUPPLY_ESTIMATE_LIMIT,
    `Expected at most ${SUPPLY_ESTIMATE_LIMIT} tokens`,
  )
const SupplyChangeEvidenceRequests = v
  .array(v.object({ chain: v.string(), address: v.string() }))
  .check(
    (requests) => requests.length <= SUPPLY_CHANGE_EVIDENCE_LIMIT,
    `Expected at most ${SUPPLY_CHANGE_EVIDENCE_LIMIT} tokens`,
  )

export function tvsCoverageRouter({
  coingeckoClient,
}: {
  coingeckoClient: CoingeckoClient
}) {
  return router({
    get: readOnlyProcedure
      .input(v.object({ hours: WindowHours }))
      .query(({ ctx, input }) =>
        getTvsCoverageData(ctx.db, ctx.tokenDb, input.hours),
      ),
    getSupplyEstimates: readOnlyProcedure
      .input(SupplyEstimateRequests)
      .query(({ ctx, input }) =>
        getSupplyEstimates(ctx.db, ctx.tokenDb, input, {
          getCoinsMarketData: (ids) => coingeckoClient.getCoinsMarketData(ids),
        }),
      ),
    getSupplyChangeEvidence: readOnlyProcedure
      .input(SupplyChangeEvidenceRequests)
      .query(({ ctx, input }) =>
        getSupplyChangeEvidence(ctx.db, ctx.tokenDb, input),
      ),
  })
}
