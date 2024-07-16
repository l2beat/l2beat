import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Block } from '../kysely/generated/types'

export interface BlockTransactionCountRecord {
  projectId: ProjectId
  blockNumber: number
  count: number
  timestamp: UnixTime
}

export function toRow(record: BlockTransactionCountRecord): Insertable<Block> {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    block_number: record.blockNumber,
    count: record.count,
  }
}

export function toRecord(row: Selectable<Block>): BlockTransactionCountRecord {
  return {
    projectId: ProjectId(row.project_id),
    blockNumber: row.block_number,
    count: row.count,
    timestamp: UnixTime.fromDate(row.unix_timestamp),
  }
}
