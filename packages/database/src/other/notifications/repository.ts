import { BaseRepository } from '../../BaseRepository'
import { type NotificationRecord, toRecord, toRow } from './entity'
import { selectNotification } from './select'

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
    const rows = await this.db
      .selectFrom('Notification')
      .select(selectNotification)
      .execute()

    return rows.map(toRecord)
  }

  async getByRelatedEntityId(
    relatedEntityId: string,
  ): Promise<NotificationRecord[]> {
    const rows = await this.db
      .selectFrom('Notification')
      .select(selectNotification)
      .where('relatedEntityId', '=', relatedEntityId)
      .execute()
    return rows.map(toRecord)
  }
}
