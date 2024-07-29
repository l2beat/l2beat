import { BaseRepository } from '../../BaseRepository'
import { IndexerStateRecord, toRecord, toRow } from './entity'

export class IndexerStateRepository extends BaseRepository {
  async upsert(record: IndexerStateRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: IndexerStateRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('public.indexer_state')
        .values(batch)
        .onConflict((cb) =>
          cb.column('indexer_id').doUpdateSet((eb) => ({
            safe_height: eb.ref('excluded.safe_height'),
            config_hash: eb.ref('excluded.config_hash'),
            min_timestamp: eb.ref('excluded.min_timestamp'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async getByIndexerIds(ids: string[]) {
    if (ids.length === 0) return []

    const rows = await this.db
      .selectFrom('public.indexer_state')
      .selectAll()
      .where('indexer_id', 'in', ids)
      .execute()
    return rows.map(toRecord)
  }

  async findByIndexerId(
    indexerId: string,
  ): Promise<IndexerStateRecord | undefined> {
    const row = await this.db
      .selectFrom('public.indexer_state')
      .selectAll()
      .where('indexer_id', '=', indexerId)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async updateSafeHeight(
    indexerId: string,
    safeHeight: number,
  ): Promise<number> {
    const result = await this.db
      .updateTable('public.indexer_state')
      .set('safe_height', safeHeight)
      .where('indexer_id', '=', indexerId)
      .executeTakeFirst()
    return Number(result.numUpdatedRows)
  }

  async getAll(): Promise<IndexerStateRecord[]> {
    const rows = await this.db
      .selectFrom('public.indexer_state')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.indexer_state')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
