import { BaseRepository } from '../../BaseRepository'
import { StarkExTransactionCountRecord, toRecord, toRow } from './entity'
import { selectStarkExTransactionCount } from './select'

export class StarkExTransactionCountRepository extends BaseRepository {
  async upsertMany(records: StarkExTransactionCountRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('activity.starkex')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['project_id', 'unix_timestamp']).doUpdateSet((eb) => ({
            count: eb.ref('excluded.count'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('activity.starkex')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<StarkExTransactionCountRecord[]> {
    const rows = await this.db
      .selectFrom('activity.starkex')
      .select(selectStarkExTransactionCount)
      .execute()
    return rows.map(toRecord)
  }
}
