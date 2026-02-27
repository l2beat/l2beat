import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { getInteropTransferValue, type UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import type {
  InteropProtocolTransferDetailsItem,
  InteropProtocolTransferStats,
  InteropProtocolTransfersParams,
  InteropProtocolTransfersResponse,
} from './types'
import { getAggregatedInteropTimestamp } from './utils/getAggregatedInteropTimestamp'

interface TransfersWithStats {
  items: InteropTransferRecord[]
  transferStats: InteropProtocolTransferStats
}

export async function getInteropProtocolTransfers({
  id,
  from,
  to,
  type,
}: InteropProtocolTransfersParams): Promise<InteropProtocolTransfersResponse> {
  if (from.length === 0 || to.length === 0) {
    return {
      items: [],
      transferStats: undefined,
    }
  }

  const interopProject = await ps.getProject({
    id,
    select: ['interopConfig'],
  })
  if (!interopProject?.interopConfig) {
    return {
      items: [],
      transferStats: undefined,
    }
  }

  const plugins = type
    ? interopProject.interopConfig.plugins.filter(
        (plugin) => plugin.bridgeType === type,
      )
    : interopProject.interopConfig.plugins
  if (plugins.length === 0) {
    return {
      items: [],
      transferStats: undefined,
    }
  }

  const snapshotTimestamp = await getAggregatedInteropTimestamp()
  if (!snapshotTimestamp) {
    return {
      items: [],
      transferStats: undefined,
    }
  }

  const classifier = new InteropTransferClassifier()
  const matcher = classifier.createMatcher<InteropTransferRecord>(plugins)
  const pluginIds = [...new Set(plugins.map((plugin) => plugin.plugin))]
  const result = await getFilteredTransfersWithStats({
    snapshotTimestamp,
    sourceChains: from,
    destinationChains: to,
    pluginIds,
    matcher,
  })
  return {
    items: result.items.map(toInteropProtocolTransferDetailsItem),
    transferStats: result.transferStats,
  }
}

async function getFilteredTransfersWithStats({
  snapshotTimestamp,
  sourceChains,
  destinationChains,
  pluginIds,
  matcher,
}: {
  snapshotTimestamp: UnixTime
  sourceChains: string[]
  destinationChains: string[]
  pluginIds: string[]
  matcher: (transfer: InteropTransferRecord) => boolean
}): Promise<TransfersWithStats> {
  const db = getDb()

  const allTransfers = await db.interopTransfer.getProjectTransfers({
    plugins: pluginIds,
    snapshotTimestamp,
    sourceChains,
    destinationChains,
  })
  const items = allTransfers.filter(matcher)
  const transferStats = items.reduce<InteropProtocolTransferStats>(
    (acc, transfer) => {
      acc.transferCount += 1
      acc.volume += getInteropTransferValue(transfer) ?? 0
      return acc
    },
    { transferCount: 0, volume: 0 },
  )

  return {
    items,
    transferStats,
  }
}

export function toInteropProtocolTransferDetailsItem(
  transfer: InteropTransferRecord,
): InteropProtocolTransferDetailsItem {
  return {
    transferId: transfer.transferId,
    timestamp: transfer.timestamp,
    srcAmount: transfer.srcAmount,
    srcSymbol: transfer.srcSymbol,
    dstAmount: transfer.dstAmount,
    dstSymbol: transfer.dstSymbol,
    valueUsd: transfer.srcValueUsd ?? transfer.dstValueUsd,
    duration: transfer.duration,
    srcChain: transfer.srcChain,
    srcTxHash: transfer.srcTxHash,
    dstChain: transfer.dstChain,
    dstTxHash: transfer.dstTxHash,
  }
}
