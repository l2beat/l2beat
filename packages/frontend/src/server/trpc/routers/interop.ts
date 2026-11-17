import { TRPCError } from '@trpc/server'
import { env } from '~/env'
import { getIntentBridgesData } from '~/server/features/layer2s/interop/getIntentBridgesData'
import { getInteropBridgeSelectionData } from '~/server/features/layer2s/interop/getInteropBridgeSelectionData'
import { getInteropDashboardData } from '~/server/features/layer2s/interop/getInteropDashboardData'
import { getInteropFlows } from '~/server/features/layer2s/interop/getInteropFlows'
import { getInteropFlowsOverview } from '~/server/features/layer2s/interop/getInteropFlowsOverview'
import { getInteropProtocolsByVolume } from '~/server/features/layer2s/interop/getInteropProtocolsByVolume'
import { getInteropProtocolTransfers } from '~/server/features/layer2s/interop/getInteropProtocolTransfers'
import { getInteropTokenData } from '~/server/features/layer2s/interop/getInteropTokenData'
import { getInteropTokensInfinite } from '~/server/features/layer2s/interop/getInteropTokens'
import { getInteropTokensPairsInfinite } from '~/server/features/layer2s/interop/getInteropTokensPairs'
import { getInteropTokenTransfers } from '~/server/features/layer2s/interop/getInteropTokenTransfers'
import { getTokenFrameworksData } from '~/server/features/layer2s/interop/getTokenFrameworksData'
import { getInteropHistory } from '~/server/features/layer2s/interop/history/getInteropHistory'
import { InteropHistoryParams } from '~/server/features/layer2s/interop/history/types'
import {
  InteropBridgeSelectionParams,
  InteropDashboardParams,
  InteropFlowsParams,
  InteropProtocolsByVolumeParams,
  InteropProtocolTransfersParams,
  InteropSelectionInput,
  InteropTokenParams,
  InteropTokenTransfersParams,
  InteropTopItemsInfiniteParams,
} from '~/server/features/layer2s/interop/types'
import { procedure, router } from '../trpc'

/** For the history prototype alone, so with the page off nobody runs its queries */
const historyProcedure = procedure.use(({ next }) => {
  if (!env.CLIENT_SIDE_INTEROP_HISTORY_ENABLED) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }
  return next()
})

export const interopRouter = router({
  dashboard: procedure
    .input(InteropDashboardParams)
    .query(({ input }) => getInteropDashboardData(input)),
  bridgeSelection: procedure
    .input(InteropBridgeSelectionParams)
    .query(({ input }) => getInteropBridgeSelectionData(input)),
  tokenDashboard: procedure
    .input(InteropTokenParams)
    .query(({ input }) => getInteropTokenData(input)),
  tokenTransfers: procedure
    .input(InteropTokenTransfersParams)
    .query(({ input }) => getInteropTokenTransfers(input)),
  tokenFrameworks: procedure
    .input(InteropSelectionInput)
    .query(({ input }) => getTokenFrameworksData(input)),
  intentBridges: procedure
    .input(InteropSelectionInput)
    .query(({ input }) => getIntentBridgesData(input)),
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
  flowsOverview: procedure
    .input(InteropFlowsParams)
    .query(({ input }) => getInteropFlowsOverview(input)),
  protocolsByVolume: procedure
    .input(InteropProtocolsByVolumeParams)
    .query(({ input }) => getInteropProtocolsByVolume(input)),
  history: historyProcedure
    .input(InteropHistoryParams)
    .query(({ input }) => getInteropHistory(input)),
})
