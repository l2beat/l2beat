import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { BridgeMessage } from '../../kysely/generated/types'

export interface BridgeMessageRecord {
  messageId: string
  type: string
  durationMs: number
  expiresAt: UnixTime
  srcTime: UnixTime
  srcChain: string
  srcTxHash: string
  srcLogIndex: number
  dstTime: UnixTime
  dstChain: string
  dstTxHash: string
  dstLogIndex: number
}

export function toRecord(row: Selectable<BridgeMessage>): BridgeMessageRecord {
  return {
    messageId: row.messageId,
    type: row.type,
    durationMs: row.durationMs,
    expiresAt: UnixTime.fromDate(row.expiresAt),
    srcTime: UnixTime.fromDate(row.srcTime),
    srcChain: row.srcChain,
    srcTxHash: row.srcTxHash,
    srcLogIndex: row.srcLogIndex,
    dstTime: UnixTime.fromDate(row.dstTime),
    dstChain: row.dstChain,
    dstTxHash: row.dstTxHash,
    dstLogIndex: row.dstLogIndex,
  }
}

export function toRow(record: BridgeMessageRecord): Insertable<BridgeMessage> {
  return {
    messageId: record.messageId,
    type: record.type,
    durationMs: record.durationMs,
    expiresAt: UnixTime.toDate(record.expiresAt),
    srcTime: UnixTime.toDate(record.srcTime),
    srcChain: record.srcChain,
    srcTxHash: record.srcTxHash,
    srcLogIndex: record.srcLogIndex,
    dstTime: UnixTime.toDate(record.dstTime),
    dstChain: record.dstChain,
    dstTxHash: record.dstTxHash,
    dstLogIndex: record.dstLogIndex,
  }
}
