import type { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type UpdateMessageRecord, toRecord, toRow } from './entity'
import { selectUpdateMessage } from './select'

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
            .columns(['projectName', 'chain', 'blockNumber'])
            .doUpdateSet((eb) => ({
              timestamp: eb.ref('excluded.timestamp'),
              message: eb.ref('excluded.message'),
            })),
        )
        .execute()
    })
    return records.length
  }

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('UpdateMessage')
      .where('timestamp', '<', timestamp.toDate())
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<UpdateMessageRecord[]> {
    const rows = await this.db
      .selectFrom('UpdateMessage')
      .select(selectUpdateMessage)
      .orderBy('timestamp', 'desc')
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('UpdateMessage').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
