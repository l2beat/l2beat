import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { buildInteropTokenData } from './getInteropTokens'
import type { InteropBridgeSelectionParams, TokenData } from './types'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import {
  aggregateTransferSize,
  aggregateTransferType,
  type TransferSizeDistribution,
  type TransferTypeDataPoint,
} from './utils/getTransferSizeChartData'

export interface InteropBridgeSelectionData {
  transferSize: TransferSizeDistribution | undefined
  transferType: TransferTypeDataPoint | undefined
  tokens: TokenData[]
  snapshotTimestamp: UnixTime | undefined
}

const EMPTY: InteropBridgeSelectionData = {
  transferSize: undefined,
  transferType: undefined,
  tokens: [],
  snapshotTimestamp: undefined,
}

const cache = new FrontendInMemoryCache('getInteropBridgeSelectionData')

export async function getInteropBridgeSelectionData(
  params: InteropBridgeSelectionParams,
): Promise<InteropBridgeSelectionData> {
  if (
    env.MOCK ||
    params.from.length === 0 ||
    params.to.length === 0 ||
    params.protocolIds.length === 0
  ) {
    return EMPTY
  }

  return await cache.get(
    {
      key: [
        'interop-bridge-selection',
        [...params.from].sort().join(','),
        [...params.to].sort().join(','),
        [...params.protocolIds].sort().join(','),
        params.anchorChain ?? 'all',
      ],
      ttl: 60 * 10,
      staleWhileRevalidate: 60 * 15,
    },
    () => buildBridgeSelectionData(params),
  )
}

async function buildBridgeSelectionData(
  params: InteropBridgeSelectionParams,
): Promise<InteropBridgeSelectionData> {
  const [{ records, snapshotTimestamp }, interopProjects] = await Promise.all([
    getLatestAggregatedInteropTransferWithTokens({
      selection: { from: params.from, to: params.to },
      protocolIds: params.protocolIds,
      anchorChain: params.anchorChain,
    }),
    ps.getProjects({ select: ['interopConfig'] }),
  ])

  return {
    transferSize: aggregateTransferSize(records),
    transferType: aggregateTransferType(records),
    tokens: await buildInteropTokenData({
      records,
      interopProject: undefined,
      interopProjects,
      type: undefined,
    }),
    snapshotTimestamp,
  }
}
