import { INTEROP_CHAINS } from '@l2beat/config'
import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import {
  assert,
  getInteropTransferValue,
  type UnixTime,
} from '@l2beat/shared-pure'
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

const INTEROP_CHAIN_TX_EXPLORER_URLS = new Map(
  INTEROP_CHAINS.map((chain) => [chain.id, chain.txExplorerUrl]),
)

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
    items: result.items.map((transfer) =>
      toInteropProtocolTransferDetailsItem(
        transfer,
        INTEROP_CHAIN_TX_EXPLORER_URLS,
      ),
    ),
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
  return collectMatchedTransfersWithStats(allTransfers, matcher)
}

// This is not the actual way we sum transfers in aggregates, but we don't want to duplicate all the logic. Therefore, we simplify it here and perform a 1% comparison check on the frontend.
export function collectMatchedTransfersWithStats(
  transfers: InteropTransferRecord[],
  matcher: (transfer: InteropTransferRecord) => boolean,
): TransfersWithStats {
  const items: InteropTransferRecord[] = []
  let transferCount = 0
  let volume = 0

  for (const transfer of transfers) {
    if (!matcher(transfer)) {
      continue
    }

    items.push(transfer)
    transferCount += 1
    volume += getInteropTransferValue(transfer) ?? 0
  }

  return {
    items,
    transferStats: {
      transferCount,
      volume,
    },
  }
}

export function toInteropProtocolTransferDetailsItem(
  transfer: InteropTransferRecord,
  chainExplorerUrlsById: Map<string, string>,
): InteropProtocolTransferDetailsItem {
  const srcTxHashHref = getTxHashHref(
    chainExplorerUrlsById,
    transfer.srcChain,
    transfer.srcTxHash,
  )
  const dstTxHashHref = getTxHashHref(
    chainExplorerUrlsById,
    transfer.dstChain,
    transfer.dstTxHash,
  )

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
    srcTxHashHref,
    dstChain: transfer.dstChain,
    dstTxHash: transfer.dstTxHash,
    dstTxHashHref,
  }
}

function getTxHashHref(
  chainExplorerUrlsById: Map<string, string>,
  chainId: string,
  txHash: string,
): string {
  const txExplorerUrl = chainExplorerUrlsById.get(chainId)
  assert(txExplorerUrl, `Missing tx explorer URL for chain: ${chainId}`)

  return `${txExplorerUrl}${txHash}`
}
