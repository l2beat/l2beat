import { getInteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { getInteropFlows } from '~/server/features/scaling/interop/getInteropFlows'
import { getInteropProtocolTransfers } from '~/server/features/scaling/interop/getInteropProtocolTransfers'
import { getInteropTokenData } from '~/server/features/scaling/interop/getInteropTokenData'
import { getInteropTokensInfinite } from '~/server/features/scaling/interop/getInteropTokens'
import { getInteropTokensPairsInfinite } from '~/server/features/scaling/interop/getInteropTokensPairs'
import { getInteropTokenTransfers } from '~/server/features/scaling/interop/getInteropTokenTransfers'
import {
  InteropDashboardParams,
  InteropFlowsParams,
  InteropProtocolTransfersParams,
  InteropTokenParams,
  InteropTokenTransfersParams,
  InteropTopItemsInfiniteParams,
} from '~/server/features/scaling/interop/types'
import { procedure, router } from '../trpc'

export const interopRouter = router({
  dashboard: procedure
    .input(InteropDashboardParams)
    .query(({ input }) => getInteropDashboardData(input)),
  tokenDashboard: procedure
    .input(InteropTokenParams)
    .query(({ input }) => getInteropTokenData(input)),
  tokenTransfers: procedure
    .input(InteropTokenTransfersParams)
    .query(({ input }) => getInteropTokenTransfers(input)),
  tokens: procedure
    .input(InteropTopItemsInfiniteParams)
    .query(({ input }) => getInteropTokensInfinite(input)),
  tokensPairs: procedure
    .input(InteropTopItemsInfiniteParams)
    .query(({ input }) => getInteropTokensPairsInfinite(input)),
  transfers: procedure
    .input(InteropProtocolTransfersParams)
    .query(({ input }) => getInteropProtocolTransfers(input)),
  flows: procedure
    .input(InteropFlowsParams)
    .query(({ input }) => getInteropFlows(input)),
})
