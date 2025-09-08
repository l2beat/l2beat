import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { BridgeMessage } from '../../kysely/generated/types'

export interface BridgeMessageRecord {
  messageId: string
  type: string
  duration: number | undefined
  timestamp: UnixTime
  srcTime: UnixTime | undefined
  srcChain: string | undefined
  srcTxHash: string | undefined
  srcLogIndex: number | undefined
  srcEventId: string | undefined
  dstTime: UnixTime | undefined
  dstChain: string | undefined
  dstTxHash: string | undefined
  dstLogIndex: number | undefined
  dstEventId: string | undefined
}

export function toRecord(row: Selectable<BridgeMessage>): BridgeMessageRecord {
  return {
    messageId: row.messageId,
    type: row.type,
    duration: row.duration ?? undefined,
    timestamp: UnixTime.fromDate(row.timestamp),
    srcTime: row.srcTime !== null ? UnixTime.fromDate(row.srcTime) : undefined,
    srcChain: row.srcChain ?? undefined,
    srcTxHash: row.srcTxHash ?? undefined,
    srcLogIndex: row.srcLogIndex ?? undefined,
    srcEventId: row.srcEventId ?? undefined,
    dstTime: row.dstTime !== null ? UnixTime.fromDate(row.dstTime) : undefined,
    dstChain: row.dstChain ?? undefined,
    dstTxHash: row.dstTxHash ?? undefined,
    dstLogIndex: row.dstLogIndex ?? undefined,
    dstEventId: row.dstEventId ?? undefined,
  }
}

export function toRow(record: BridgeMessageRecord): Insertable<BridgeMessage> {
  return {
    messageId: record.messageId,
    type: record.type,
    duration: record.duration,
    timestamp: UnixTime.toDate(record.timestamp),
    srcTime:
      record.srcTime !== undefined ? UnixTime.toDate(record.srcTime) : null,
    srcChain: record.srcChain,
    srcTxHash: record.srcTxHash,
    srcLogIndex: record.srcLogIndex,
    srcEventId: record.srcEventId,
    dstTime:
      record.dstTime !== undefined ? UnixTime.toDate(record.dstTime) : null,
    dstChain: record.dstChain,
    dstTxHash: record.dstTxHash,
    dstLogIndex: record.dstLogIndex,
    dstEventId: record.dstEventId,
  }
}
