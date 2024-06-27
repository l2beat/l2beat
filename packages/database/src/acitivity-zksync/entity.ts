import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { ZkSync as ZkSyncTransactionRow } from '../kysely/generated/types'

export interface ZkSyncTransaction {
  blockNumber: number
  blockIndex: number
  timestamp: UnixTime
}

export function toRow(
  record: ZkSyncTransaction,
): Insertable<ZkSyncTransactionRow> {
  return {
    unix_timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    block_index: record.blockIndex,
  }
}

export function toRecord(
  row: Selectable<ZkSyncTransactionRow>,
): ZkSyncTransaction {
  return {
    blockNumber: row.block_number,
    blockIndex: row.block_index,
    timestamp: UnixTime.fromDate(row.unix_timestamp),
  }
}
