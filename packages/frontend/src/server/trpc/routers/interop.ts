import { getInteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { getInteropProtocolChains } from '~/server/features/scaling/interop/getInteropProtocolChains'
import { getInteropProtocolData } from '~/server/features/scaling/interop/getInteropProtocolData'
import { getInteropProtocolTokens } from '~/server/features/scaling/interop/getInteropProtocolTokens'
import { getInteropProtocolTransfers } from '~/server/features/scaling/interop/getInteropProtocolTransfers'
import { getInteropSummaryTokens } from '~/server/features/scaling/interop/getInteropSummaryTokens'
import {
  InteropDashboardParams,
  InteropProtocolTokensParams,
  InteropProtocolTransfersParams,
  InteropSelectionInput,
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
    .input(InteropProtocolTokensParams)
    .query(({ input }) => getInteropProtocolTokens(input)),
  summaryTokens: procedure
    .input(InteropSelectionInput)
    .query(({ input }) => getInteropSummaryTokens(input)),
  chains: procedure
    .input(InteropProtocolTokensParams)
    .query(({ input }) => getInteropProtocolChains(input)),
  transfers: procedure
    .input(InteropProtocolTransfersParams)
    .query(({ input }) => getInteropProtocolTransfers(input)),
})
