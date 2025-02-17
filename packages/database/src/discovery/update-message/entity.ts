import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { UpdateMessage } from '../../kysely/generated/types'

export interface UpdateMessageRecord {
  projectName: string
  chain: string
  blockNumber: number
  timestamp: UnixTime
  message: string
}

export function toRow(record: UpdateMessageRecord): Insertable<UpdateMessage> {
  return {
    projectName: record.projectName,
    chain: record.chain,
    blockNumber: record.blockNumber,
    timestamp: record.timestamp.toDate(),
    message: record.message,
  }
}

export function toRecord(row: Selectable<UpdateMessage>): UpdateMessageRecord {
  return {
    projectName: row.projectName,
    chain: row.chain,
    blockNumber: row.blockNumber,
    timestamp: UnixTime.fromDate(row.timestamp),
    message: row.message,
  }
}
