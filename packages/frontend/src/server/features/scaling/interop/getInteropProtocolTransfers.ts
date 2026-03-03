import { INTEROP_CHAINS } from '@l2beat/config'
import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import {
  assert,
  getInteropTransferValue,
  type UnixTime,
} from '@l2beat/shared-pure'
import { InMemoryCache } from '~/server/cache/InMemoryCache'
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

const VALUE_TOLERANCE_RATIO = 0.01
const MIN_VALUE_TOLERANCE = 0.01
const PAGE_SIZE = 100

const INTEROP_CHAIN_EXPLORER_URLS = new Map(
  INTEROP_CHAINS.map((chain) => [chain.id, chain.explorerUrl]),
)
const interopTransfersCache = new InMemoryCache()

export async function getInteropProtocolTransfers({
  id,
  from,
  to,
  type,
  expectedTransferCount,
  expectedVolume,
  cursor,
}: InteropProtocolTransfersParams): Promise<InteropProtocolTransfersResponse> {
  if (from.length === 0 || to.length === 0) {
    return {
      items: [],
      hasIntegrityMismatch: false,
      nextCursor: undefined,
    }
  }

  const interopProject = await ps.getProject({
    id,
    select: ['interopConfig'],
  })
  if (!interopProject?.interopConfig) {
    return {
      items: [],
      hasIntegrityMismatch: false,
      nextCursor: undefined,
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
      hasIntegrityMismatch: false,
      nextCursor: undefined,
    }
  }

  const snapshotTimestamp = await getAggregatedInteropTimestamp()
  if (!snapshotTimestamp) {
    return {
      items: [],
      hasIntegrityMismatch: false,
      nextCursor: undefined,
    }
  }

  const classifier = new InteropTransferClassifier()
  const matcher = classifier.createMatcher<InteropTransferRecord>(plugins)
  const pluginIds = [...new Set(plugins.map((plugin) => plugin.plugin))]
  const result = await interopTransfersCache.get(
    {
      key: [
        'interop-transfers',
        id.toString(),
        type ?? 'all',
        snapshotTimestamp.toString(),
        [...from].sort().join(','),
        [...to].sort().join(','),
        toPluginMatcherCacheKey(plugins),
      ],
      ttl: 60 * 10,
      staleWhileRevalidate: 60 * 15,
    },
    () =>
      getFilteredTransfersWithStats({
        snapshotTimestamp,
        sourceChains: from,
        destinationChains: to,
        pluginIds,
        matcher,
      }),
  )

  const startIndex = cursor ?? 0
  const pagedItems = result.items.slice(startIndex, startIndex + PAGE_SIZE)
  const nextCursor =
    startIndex + PAGE_SIZE < result.items.length
      ? startIndex + PAGE_SIZE
      : undefined

  return {
    items: pagedItems.map((transfer) =>
      toInteropProtocolTransferDetailsItem(
        transfer,
        INTEROP_CHAIN_EXPLORER_URLS,
      ),
    ),
    hasIntegrityMismatch: hasTransferStatsMismatch(
      result.transferStats,
      expectedTransferCount,
      expectedVolume,
    ),
    nextCursor,
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
  const items: InteropTransferRecord[] = []
  let transferCount = 0
  let volume = 0

  for (const transfer of allTransfers) {
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
  const explorerUrl = chainExplorerUrlsById.get(chainId)
  assert(explorerUrl, `Missing explorer URL for chain: ${chainId}`)

  return `${explorerUrl}/tx/${txHash}`
}

function toPluginMatcherCacheKey(
  plugins: {
    plugin: string
    bridgeType: string
    chain?: string
    abstractTokenId?: string
    transferType?: string
  }[],
): string {
  return plugins
    .map(
      (plugin) =>
        `${plugin.plugin}:${plugin.bridgeType}:${plugin.chain ?? ''}:${plugin.abstractTokenId ?? ''}:${plugin.transferType ?? ''}`,
    )
    .sort()
    .join('|')
}

// Note: We are not summing transfers in exactly the same way as the backend aggregates do.
// To avoid duplicating all aggregation logic here, we use a simplified calculation on the frontend
// and add this 1% difference check to allow for minor discrepancies between methods.
function hasTransferStatsMismatch(
  transferStats: InteropProtocolTransferStats,
  expectedTransferCount: number,
  expectedVolume: number,
): boolean {
  if (transferStats.transferCount !== expectedTransferCount) {
    return true
  }

  const difference = Math.abs(transferStats.volume - expectedVolume)
  const tolerance = Math.max(
    Math.abs(expectedVolume) * VALUE_TOLERANCE_RATIO,
    MIN_VALUE_TOLERANCE,
  )

  return difference > tolerance
}
