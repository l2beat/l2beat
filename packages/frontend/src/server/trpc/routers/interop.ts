import { getInteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { getInteropProtocolData } from '~/server/features/scaling/interop/getInteropProtocolData'
import { getInteropProtocolTransfers } from '~/server/features/scaling/interop/getInteropProtocolTransfers'
import { getInteropTokens } from '~/server/features/scaling/interop/getInteropTokens'
import { getInteropTokensPairs } from '~/server/features/scaling/interop/getInteropTokensPairs'
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
  tokensPairs: procedure
    .input(InteropTopItemsParams)
    .query(({ input }) => getInteropTokensPairs(input)),
  transfers: procedure
    .input(InteropProtocolTransfersParams)
    .query(({ input }) => getInteropProtocolTransfers(input)),
})
