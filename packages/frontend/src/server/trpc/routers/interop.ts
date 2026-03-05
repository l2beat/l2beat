import { getInteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { getInteropProtocolChains } from '~/server/features/scaling/interop/getInteropProtocolChains'
import { getInteropProtocolTokens } from '~/server/features/scaling/interop/getInteropProtocolTokens'
import { getInteropProtocolTransfers } from '~/server/features/scaling/interop/getInteropProtocolTransfers'
import {
  InteropDashboardParams,
  InteropProtocolTokensParams,
  InteropProtocolTransfersParams,
} from '~/server/features/scaling/interop/types'
import { procedure, router } from '../trpc'

export const interopRouter = router({
  dashboard: procedure
    .input(InteropDashboardParams)
    .query(({ input }) => getInteropDashboardData(input)),
  tokens: procedure
    .input(InteropProtocolTokensParams)
    .query(({ input }) => getInteropProtocolTokens(input)),
  chains: procedure
    .input(InteropProtocolTokensParams)
    .query(({ input }) => getInteropProtocolChains(input)),
  transfers: procedure
    .input(InteropProtocolTransfersParams)
    .query(({ input }) => getInteropProtocolTransfers(input)),
})
