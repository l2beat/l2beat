import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { UpdateMessage } from '../../kysely/generated/types'

export interface UpdateMessageRecord {
  projectId: string
  timestamp: UnixTime
  message: string
}

export function toRow(record: UpdateMessageRecord): Insertable<UpdateMessage> {
  return {
    projectId: record.projectId,
    timestamp: UnixTime.toDate(record.timestamp),
    message: record.message,
  }
}

export function toRecord(row: Selectable<UpdateMessage>): UpdateMessageRecord {
  return {
    projectId: row.projectId,
    timestamp: UnixTime.fromDate(row.timestamp),
    message: row.message,
  }
}
