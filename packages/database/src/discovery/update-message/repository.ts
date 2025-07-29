import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { toRecord, toRow, type UpdateMessageRecord } from './entity'

export class UpdateMessageRepository extends BaseRepository {
  async upsert(record: UpdateMessageRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: UpdateMessageRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('UpdateMessage')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['projectId', 'chain', 'timestamp'])
            .doUpdateSet((eb) => ({ message: eb.ref('excluded.message') })),
        )
        .execute()
    })
    return records.length
  }

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('UpdateMessage')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<UpdateMessageRecord[]> {
    const rows = await this.db
      .selectFrom('UpdateMessage')
      .selectAll()
      .orderBy('timestamp', 'desc')
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('UpdateMessage').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
