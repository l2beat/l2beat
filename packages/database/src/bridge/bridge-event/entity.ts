import { type EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { BridgeEvent } from '../../kysely/generated/types'

export interface BridgeEventRecord {
  eventId: string
  type: string
  expiresAt: UnixTime
  timestamp: UnixTime
  chain: string
  blockNumber: number
  blockHash: string
  txHash: string
  txTo: EthereumAddress | undefined
  logIndex: number
  args: unknown
}

export function toRecord(row: Selectable<BridgeEvent>): BridgeEventRecord {
  return {
    eventId: row.eventId,
    type: row.type,
    expiresAt: UnixTime.fromDate(row.timestamp),
    timestamp: UnixTime.fromDate(row.timestamp),
    chain: row.chain,
    blockNumber: row.blockNumber,
    blockHash: row.blockHash,
    txHash: row.txHash,
    txTo: row.txTo as EthereumAddress | undefined,
    logIndex: row.logIndex,
    args: row.args,
  }
}

export function toRow(record: BridgeEventRecord): Insertable<BridgeEvent> {
  return {
    eventId: record.eventId,
    type: record.type,
    expiresAt: UnixTime.toDate(record.timestamp),
    timestamp: UnixTime.toDate(record.timestamp),
    chain: record.chain,
    blockNumber: record.blockNumber,
    blockHash: record.blockHash,
    txHash: record.txHash,
    txTo: record.txTo ?? null,
    logIndex: record.logIndex,
    args: record.args,
  }
}
