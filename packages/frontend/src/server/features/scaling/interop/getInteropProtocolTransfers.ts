import type { InteropTransferRecord } from '@l2beat/database'
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
  if (!interopProject) {
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

  const db = getDb()
  const page = await db.interopTransfer.getProjectTransfersPage({
    plugins: interopProject.interopConfig.plugins,
    snapshotTimestamp,
    sourceChains: from,
    destinationChains: to,
    type,
    limit,
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

export function toInteropProtocolTransferDetailsItem(
  transfer: InteropTransferRecord,
): InteropProtocolTransferDetailsItem {
  return {
    transferId: transfer.transferId,
    timestamp: transfer.timestamp,
    amount: transfer.srcAmount ?? transfer.dstAmount,
    symbol: transfer.srcSymbol ?? transfer.dstSymbol,
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
