import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import type {
  InteropProtocolTransferDetailsItem,
  InteropProtocolTransfersCursor,
  InteropProtocolTransfersParams,
  InteropProtocolTransfersResponse,
} from './types'
import { getAggregatedInteropTimestamp } from './utils/getAggregatedInteropTimestamp'

const DEFAULT_PAGE_SIZE = 50
const RAW_PAGE_LIMIT_MULTIPLIER = 3
const MAX_RAW_PAGE_LIMIT = 300

interface TransferPageCursor {
  timestamp: UnixTime
  transferId: string
}

interface TransferPage {
  items: InteropTransferRecord[]
  nextCursor: TransferPageCursor | undefined
}

export async function getInteropProtocolTransfers({
  id,
  from,
  to,
  type,
  cursor,
  limit = DEFAULT_PAGE_SIZE,
}: InteropProtocolTransfersParams): Promise<InteropProtocolTransfersResponse> {
  if (from.length === 0 || to.length === 0) {
    return {
      items: [],
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
      nextCursor: undefined,
    }
  }

  const snapshotTimestamp = cursor
    ? UnixTime(cursor.snapshotTimestamp)
    : await getAggregatedInteropTimestamp()
  if (!snapshotTimestamp) {
    return {
      items: [],
      nextCursor: undefined,
    }
  }

  const classifier = new InteropTransferClassifier()
  const matcher = classifier.createMatcher<InteropTransferRecord>(plugins)
  const pluginIds = [...new Set(plugins.map((plugin) => plugin.plugin))]
  const rawLimit = Math.min(
    Math.max(limit, DEFAULT_PAGE_SIZE) * RAW_PAGE_LIMIT_MULTIPLIER,
    MAX_RAW_PAGE_LIMIT,
  )
  const page = await getFilteredProjectTransfersPage({
    snapshotTimestamp,
    sourceChains: from,
    destinationChains: to,
    pluginIds,
    limit,
    rawLimit,
    matcher,
    cursor: cursor
      ? {
          timestamp: UnixTime(cursor.timestamp),
          transferId: cursor.transferId,
        }
      : undefined,
  })

  return {
    items: page.items.map(toInteropProtocolTransferDetailsItem),
    nextCursor: toResponseCursor(page.nextCursor, snapshotTimestamp),
  }
}

async function getFilteredProjectTransfersPage({
  snapshotTimestamp,
  sourceChains,
  destinationChains,
  pluginIds,
  limit,
  rawLimit,
  matcher,
  cursor,
}: {
  snapshotTimestamp: UnixTime
  sourceChains: string[]
  destinationChains: string[]
  pluginIds: string[]
  limit: number
  rawLimit: number
  matcher: (transfer: InteropTransferRecord) => boolean
  cursor: TransferPageCursor | undefined
}): Promise<TransferPage> {
  const db = getDb()

  const items: InteropTransferRecord[] = []
  let currentCursor = cursor

  while (items.length < limit) {
    const page = await db.interopTransfer.getProjectTransfersPage({
      plugins: pluginIds,
      snapshotTimestamp,
      sourceChains,
      destinationChains,
      cursor: currentCursor,
      limit: rawLimit,
    })

    if (page.items.length === 0) {
      return { items, nextCursor: undefined }
    }

    for (const [index, transfer] of page.items.entries()) {
      currentCursor = {
        timestamp: transfer.timestamp,
        transferId: transfer.transferId,
      }

      if (!matcher(transfer)) {
        continue
      }

      items.push(transfer)

      if (items.length === limit) {
        const hasMore =
          index < page.items.length - 1 || page.nextCursor !== undefined
        return {
          items,
          nextCursor: hasMore ? currentCursor : undefined,
        }
      }
    }

    if (!page.nextCursor) {
      return { items, nextCursor: undefined }
    }

    currentCursor = page.nextCursor
  }

  return {
    items,
    nextCursor: currentCursor,
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

export function toResponseCursor(
  cursor:
    | {
        timestamp: UnixTime
        transferId: string
      }
    | undefined,
  snapshotTimestamp: UnixTime,
): InteropProtocolTransfersCursor | undefined {
  if (!cursor) {
    return undefined
  }

  return {
    timestamp: cursor.timestamp,
    transferId: cursor.transferId,
    snapshotTimestamp,
  }
}
