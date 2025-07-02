import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { Notification } from '../../kysely/generated/types'

export interface NotificationRecord {
  id: string
  channel: string
  type: string
  relatedEntityId: string
  timestamp: UnixTime
}

export function toRow(record: NotificationRecord): Insertable<Notification> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export function toRecord(row: Selectable<Notification>): NotificationRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}
