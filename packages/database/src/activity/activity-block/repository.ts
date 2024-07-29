import { BaseRepository } from '../../BaseRepository'
import { BlockTransactionCountRecord, toRecord, toRow } from './entity'
import { selectBlockTransactionCount } from './select'

export class BlockTransactionCountRepository extends BaseRepository {
  async upsertMany(records: BlockTransactionCountRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('activity.block')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['project_id', 'block_number']).doUpdateSet((eb) => ({
            unix_timestamp: eb.ref('excluded.unix_timestamp'),
            count: eb.ref('excluded.count'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('activity.block').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<BlockTransactionCountRecord[]> {
    const rows = await this.db
      .selectFrom('activity.block')
      .select(selectBlockTransactionCount)
      .execute()
    return rows.map(toRecord)
  }
}
