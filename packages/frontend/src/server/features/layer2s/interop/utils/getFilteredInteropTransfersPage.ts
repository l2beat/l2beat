import {
  type InteropTransferCursor,
  type InteropTransferRecord,
  toInteropTransferCursor,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type {
  InteropProtocolTransfersCursor,
  InteropTransfersSort,
} from '../types'
import { transferTouchesChain } from './transferTouchesChain'

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
  anchorChain,
  pluginIds,
  matcher,
  limit,
  sort,
  cursor,
}: {
  tokenId?: string
  snapshotTimestamp: number
  sourceChains: string[]
  destinationChains: string[]
  anchorChain?: string
  pluginIds: string[]
  matcher: (transfer: InteropTransferRecord) => boolean
  limit: number | undefined
  sort: InteropTransfersSort | undefined
  cursor: InteropProtocolTransfersCursor | undefined
}): Promise<TransfersPage> {
  const db = getDb()
  const items: InteropTransferRecord[] = []
  let dbCursor: InteropTransferCursor | undefined = cursor && {
    timestamp: UnixTime(cursor.timestamp),
    transferId: cursor.transferId,
    valueUsd: cursor.valueUsd ?? null,
  }
  const pageSize = getPageSize(limit)

  while (items.length < pageSize) {
    const transfers = await db.interopTransfer.getProjectTransfersPage({
      plugins: pluginIds,
      snapshotTimestamp: UnixTime(snapshotTimestamp),
      sourceChains,
      destinationChains,
      abstractTokenId: tokenId,
      sort,
      cursor: dbCursor,
      limit: RAW_BATCH_SIZE,
    })

    if (transfers.length === 0) {
      return { items, nextCursor: undefined }
    }

    for (const [i, transfer] of transfers.entries()) {
      dbCursor = toInteropTransferCursor(transfer)

      if (!matcher(transfer) || !transferTouchesChain(transfer, anchorChain)) {
        continue
      }

      items.push(transfer)

      if (items.length === pageSize) {
        const stoppedAtEnd =
          i === transfers.length - 1 && transfers.length < RAW_BATCH_SIZE
        return {
          items,
          nextCursor: stoppedAtEnd ? undefined : dbCursor,
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
