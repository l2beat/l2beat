import type {
  Database,
  InteropMessageRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import { inferInteropBridgeType } from '@l2beat/shared-pure'
import {
  INTEROP_ROWS_DEFAULT_LIMIT,
  type InteropMessage,
  type InteropMessagesResult,
  type InteropTransfer,
  type InteropTransfersResult,
  parseIntegerParam,
} from './types'
import {
  encodeCursor,
  fingerprintFilters,
  type PageCursor,
} from './utils/cursor'

/** A row query with query-string params already converted and defaulted. */
export interface InteropRowsParams {
  plugin: string
  type: string | undefined
  app: string | undefined
  srcChain: string | undefined
  dstChain: string | undefined
  from: number | undefined
  to: number | undefined
  order: 'asc' | 'desc'
  limit: number
}

export function normalizeInteropRowsQuery(query: {
  plugin: string
  type?: string
  app?: string
  srcChain?: string
  dstChain?: string
  from?: string
  to?: string
  order?: 'asc' | 'desc'
  limit?: string
}): InteropRowsParams {
  return {
    plugin: query.plugin,
    type: query.type,
    app: query.app,
    srcChain: query.srcChain,
    dstChain: query.dstChain,
    from: parseIntegerParam(query.from),
    to: parseIntegerParam(query.to),
    order: query.order ?? 'desc',
    limit: parseIntegerParam(query.limit) ?? INTEROP_ROWS_DEFAULT_LIMIT,
  }
}

/**
 * Everything that must stay fixed while walking a cursor. `limit` is
 * deliberately excluded - changing page size mid-walk is harmless.
 */
export function interopRowsFingerprint(
  kind: 'messages' | 'transfers',
  params: InteropRowsParams,
): string {
  return fingerprintFilters({
    kind,
    plugin: params.plugin,
    type: params.type,
    app: params.app,
    srcChain: params.srcChain,
    dstChain: params.dstChain,
    from: params.from,
    to: params.to,
    order: params.order,
  })
}

export async function getInteropMessagesData(
  db: Database,
  params: InteropRowsParams,
  cursor: PageCursor | undefined,
): Promise<InteropMessagesResult> {
  const rows = await db.interopMessage.getPage({
    filter: {
      plugin: params.plugin,
      type: params.type,
      app: params.app,
      srcChain: params.srcChain,
      dstChain: params.dstChain,
      from: params.from,
      to: params.to,
    },
    order: params.order,
    // One extra row tells us whether a next page exists without a count query.
    limit: params.limit + 1,
    cursor: cursor && { timestamp: cursor.timestamp, messageId: cursor.id },
  })

  const page = rows.slice(0, params.limit)
  const last = rows.length > params.limit ? page.at(-1) : undefined

  return {
    data: page.map(toInteropMessage),
    nextCursor: last
      ? encodeCursor(
          { timestamp: last.timestamp, id: last.messageId },
          interopRowsFingerprint('messages', params),
        )
      : null,
  }
}

export async function getInteropTransfersData(
  db: Database,
  params: InteropRowsParams,
  cursor: PageCursor | undefined,
): Promise<InteropTransfersResult> {
  const rows = await db.interopTransfer.getPage({
    filter: {
      plugin: params.plugin,
      type: params.type,
      srcChain: params.srcChain,
      dstChain: params.dstChain,
      from: params.from,
      to: params.to,
    },
    order: params.order,
    // One extra row tells us whether a next page exists without a count query.
    limit: params.limit + 1,
    cursor: cursor && { timestamp: cursor.timestamp, transferId: cursor.id },
  })

  const page = rows.slice(0, params.limit)
  const last = rows.length > params.limit ? page.at(-1) : undefined

  return {
    data: page.map(toInteropTransfer),
    nextCursor: last
      ? encodeCursor(
          { timestamp: last.timestamp, id: last.transferId },
          interopRowsFingerprint('transfers', params),
        )
      : null,
  }
}

function toInteropMessage(record: InteropMessageRecord): InteropMessage {
  return {
    plugin: record.plugin,
    type: record.type,
    app: record.app,
    messageId: record.messageId,
    timestamp: record.timestamp,
    duration: record.duration ?? null,
    srcChain: record.srcChain ?? null,
    srcTime: record.srcTime ?? null,
    srcTxHash: record.srcTxHash ?? null,
    srcLogIndex: record.srcLogIndex ?? null,
    dstChain: record.dstChain ?? null,
    dstTime: record.dstTime ?? null,
    dstTxHash: record.dstTxHash ?? null,
    dstLogIndex: record.dstLogIndex ?? null,
  }
}

function toInteropTransfer(record: InteropTransferRecord): InteropTransfer {
  return {
    plugin: record.plugin,
    type: record.type,
    transferId: record.transferId,
    bridgeType: record.bridgeType ?? inferInteropBridgeType(record),
    timestamp: record.timestamp,
    duration: record.duration ?? null,
    srcChain: record.srcChain,
    srcTime: record.srcTime ?? null,
    srcTxHash: record.srcTxHash ?? null,
    srcLogIndex: record.srcLogIndex ?? null,
    srcTokenAddress: record.srcTokenAddress ?? null,
    srcAbstractTokenId: record.srcAbstractTokenId ?? null,
    srcSymbol: record.srcSymbol ?? null,
    srcRawAmount: record.srcRawAmount?.toString() ?? null,
    srcAmount: record.srcAmount ?? null,
    srcPrice: record.srcPrice ?? null,
    srcValueUsd: record.srcValueUsd ?? null,
    srcWasBurned: record.srcWasBurned ?? null,
    dstChain: record.dstChain,
    dstTime: record.dstTime ?? null,
    dstTxHash: record.dstTxHash ?? null,
    dstLogIndex: record.dstLogIndex ?? null,
    dstTokenAddress: record.dstTokenAddress ?? null,
    dstAbstractTokenId: record.dstAbstractTokenId ?? null,
    dstSymbol: record.dstSymbol ?? null,
    dstRawAmount: record.dstRawAmount?.toString() ?? null,
    dstAmount: record.dstAmount ?? null,
    dstPrice: record.dstPrice ?? null,
    dstValueUsd: record.dstValueUsd ?? null,
    dstWasMinted: record.dstWasMinted ?? null,
    isProcessed: record.isProcessed,
  }
}
