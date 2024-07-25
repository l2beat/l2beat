import { BaseRepository } from '../../BaseRepository'
import { ZkSyncTransactionRecord, toRecord, toRow } from './entity'
import { selectZksyncTransaction } from './select'

export class ZkSyncTransactionRepository extends BaseRepository {
  async upsertMany(records: ZkSyncTransactionRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('activity.zksync')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['block_number', 'block_index']).doUpdateSet((eb) => ({
            unix_timestamp: eb.ref('excluded.unix_timestamp'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('activity.zksync')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<ZkSyncTransactionRecord[]> {
    const rows = await this.db
      .selectFrom('activity.zksync')
      .select(selectZksyncTransaction)
      .execute()
    return rows.map(toRecord)
  }
}
