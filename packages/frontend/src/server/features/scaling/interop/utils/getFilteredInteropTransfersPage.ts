import type { InteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type { InteropProtocolTransfersCursor } from '../types'

interface TransfersPage {
  items: InteropTransferRecord[]
  nextCursor: InteropProtocolTransfersCursor | undefined
}

const DEFAULT_PAGE_SIZE = 100
const MAX_PAGE_SIZE = 100
const RAW_BATCH_SIZE = 500

export async function getFilteredInteropTransfersPage({
  tokenId,
  snapshotTimestamp,
  sourceChains,
  destinationChains,
  pluginIds,
  matcher,
  limit,
  cursor,
}: {
  tokenId?: string
  snapshotTimestamp: number
  sourceChains: string[]
  destinationChains: string[]
  pluginIds: string[]
  matcher: (transfer: InteropTransferRecord) => boolean
  limit: number | undefined
  cursor: InteropProtocolTransfersCursor | undefined
}): Promise<TransfersPage> {
  const db = getDb()
  const items: InteropTransferRecord[] = []
  let dbCursor = cursor
  const pageSize = getPageSize(limit)

  while (items.length < pageSize) {
    const transfers = await db.interopTransfer.getProjectTransfersPage({
      plugins: pluginIds,
      snapshotTimestamp: UnixTime(snapshotTimestamp),
      sourceChains,
      destinationChains,
      cursor: dbCursor
        ? {
            timestamp: UnixTime(dbCursor.timestamp),
            transferId: dbCursor.transferId,
          }
        : undefined,
      limit: RAW_BATCH_SIZE,
    })

    if (transfers.length === 0) {
      return { items, nextCursor: undefined }
    }

    for (const [i, transfer] of transfers.entries()) {
      dbCursor = toTransferCursor(transfer)

      if (!matcher(transfer) || !matchesTokenId(transfer, tokenId)) {
        continue
      }

      items.push(transfer)

      if (items.length === pageSize) {
        const stoppedAtEnd =
          i === transfers.length - 1 && transfers.length < RAW_BATCH_SIZE
        return {
          items,
          nextCursor: stoppedAtEnd ? undefined : toTransferCursor(transfer),
        }
      }
    }

    if (transfers.length < RAW_BATCH_SIZE) {
      return { items, nextCursor: undefined }
    }
  }

  return { items, nextCursor: undefined }
}

function getPageSize(limit: number | undefined): number {
  if (limit === undefined) {
    return DEFAULT_PAGE_SIZE
  }

  const pageSize = Math.floor(limit)
  if (!Number.isFinite(pageSize)) {
    return DEFAULT_PAGE_SIZE
  }

  return Math.max(1, Math.min(MAX_PAGE_SIZE, pageSize))
}

function toTransferCursor(
  transfer: Pick<InteropTransferRecord, 'timestamp' | 'transferId'>,
): InteropProtocolTransfersCursor {
  return {
    timestamp: transfer.timestamp,
    transferId: transfer.transferId,
  }
}

function matchesTokenId(
  transfer: InteropTransferRecord,
  tokenId: string | undefined,
): boolean {
  return (
    tokenId === undefined ||
    transfer.srcAbstractTokenId === tokenId ||
    transfer.dstAbstractTokenId === tokenId
  )
}
