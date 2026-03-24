import { getInteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { getInteropProtocolChains } from '~/server/features/scaling/interop/getInteropProtocolChains'
import { getInteropProtocolData } from '~/server/features/scaling/interop/getInteropProtocolData'
import { getInteropPairs } from '~/server/features/scaling/interop/getInteropProtocolPairs'
import { getInteropTokens } from '~/server/features/scaling/interop/getInteropProtocolTokens'
import { getInteropProtocolTransfers } from '~/server/features/scaling/interop/getInteropProtocolTransfers'
import {
  InteropDashboardParams,
  InteropProtocolTokensParams,
  InteropProtocolTransfersParams,
  InteropTopItemsParams,
} from '~/server/features/scaling/interop/types'
import { procedure, router } from '../trpc'

export const interopRouter = router({
  dashboard: procedure
    .input(InteropDashboardParams)
    .query(({ input }) => getInteropDashboardData(input)),
  protocol: procedure
    .input(InteropProtocolTokensParams)
    .query(({ input }) => getInteropProtocolData(input)),
  tokens: procedure
    .input(InteropTopItemsParams)
    .query(({ input }) => getInteropTokens(input)),
  pairs: procedure
    .input(InteropTopItemsParams)
    .query(({ input }) => getInteropPairs(input)),
  chains: procedure
    .input(InteropProtocolTokensParams)
    .query(({ input }) => getInteropProtocolChains(input)),
  transfers: procedure
    .input(InteropProtocolTransfersParams)
    .query(({ input }) => getInteropProtocolTransfers(input)),
})
