import { getIntentBridgesData } from '~/server/features/layer2s/interop/getIntentBridgesData'
import { getInteropBridgeSelectionData } from '~/server/features/layer2s/interop/getInteropBridgeSelectionData'
import { getInteropDashboardData } from '~/server/features/layer2s/interop/getInteropDashboardData'
import { getInteropFlows } from '~/server/features/layer2s/interop/getInteropFlows'
import { getInteropProtocolsByVolume } from '~/server/features/layer2s/interop/getInteropProtocolsByVolume'
import { getInteropProtocolTransfers } from '~/server/features/layer2s/interop/getInteropProtocolTransfers'
import { getInteropTokenData } from '~/server/features/layer2s/interop/getInteropTokenData'
import { getInteropTokensInfinite } from '~/server/features/layer2s/interop/getInteropTokens'
import { getInteropTokensPairsInfinite } from '~/server/features/layer2s/interop/getInteropTokensPairs'
import { getInteropTokenTransfers } from '~/server/features/layer2s/interop/getInteropTokenTransfers'
import {
  getInteropTransferTime,
  getInteropTransferTimeAverages,
  getInteropTransferTimeRoutes,
} from '~/server/features/layer2s/interop/getInteropTransferTime'
import { getTokenFrameworksData } from '~/server/features/layer2s/interop/getTokenFrameworksData'
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
  InteropTransferTimeAveragesParams,
  InteropTransferTimeParams,
  InteropTransferTimeRoutesParams,
} from '~/server/features/layer2s/interop/types'
import { procedure, router } from '../trpc'

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
  transferTime: procedure
    .input(InteropTransferTimeParams)
    .query(({ input }) => getInteropTransferTime(input)),
  transferTimeAverages: procedure
    .input(InteropTransferTimeAveragesParams)
    .query(({ input }) => getInteropTransferTimeAverages(input)),
  transferTimeRoutes: procedure
    .input(InteropTransferTimeRoutesParams)
    .query(({ input }) => getInteropTransferTimeRoutes(input)),
  protocolsByVolume: procedure
    .input(InteropProtocolsByVolumeParams)
    .query(({ input }) => getInteropProtocolsByVolume(input)),
})
