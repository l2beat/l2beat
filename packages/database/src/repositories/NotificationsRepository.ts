import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { Notification } from '../kysely/generated/types'

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

export class NotificationsRepository extends BaseRepository {
  async insertMany(records: NotificationRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('Notification').values(batch).execute()
    })
    return rows.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Notification').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<NotificationRecord[]> {
    const rows = await this.db.selectFrom('Notification').selectAll().execute()

    return rows.map(toRecord)
  }

  async getByRelatedEntityId(
    relatedEntityId: string,
  ): Promise<NotificationRecord[]> {
    const rows = await this.db
      .selectFrom('Notification')
      .selectAll()
      .where('relatedEntityId', '=', relatedEntityId)
      .execute()
    return rows.map(toRecord)
  }
}
