import { getInteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { getProtocolChains } from '~/server/features/scaling/interop/getProtocolChains'
import { getProtocolTokens } from '~/server/features/scaling/interop/getProtocolTokens'
import {
  InteropDashboardParams,
  InteropProtocolTokensParams,
} from '~/server/features/scaling/interop/types'
import { procedure, router } from '../trpc'

export const interopRouter = router({
  dashboard: procedure
    .input(InteropDashboardParams)
    .query(({ input }) => getInteropDashboardData(input)),
  tokens: procedure
    .input(InteropProtocolTokensParams)
    .query(({ input }) => getProtocolTokens(input)),
  chains: procedure
    .input(InteropProtocolTokensParams)
    .query(({ input }) => getProtocolChains(input)),
})
