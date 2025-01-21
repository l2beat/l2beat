import { BaseRepository } from '../../BaseRepository'
import { type IndexerStateRecord, toRecord, toRow } from './entity'

export class IndexerStateRepository extends BaseRepository {
  async upsert(record: IndexerStateRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: IndexerStateRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('IndexerState')
        .values(batch)
        .onConflict((cb) =>
          cb.column('indexerId').doUpdateSet((eb) => ({
            safeHeight: eb.ref('excluded.safeHeight'),
            configHash: eb.ref('excluded.configHash'),
            minTimestamp: eb.ref('excluded.minTimestamp'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async getByIndexerIds(ids: string[]) {
    if (ids.length === 0) return []

    const rows = await this.db
      .selectFrom('IndexerState')
      .selectAll()
      .where('indexerId', 'in', ids)
      .execute()
    return rows.map(toRecord)
  }

  async findByIndexerId(
    indexerId: string,
  ): Promise<IndexerStateRecord | undefined> {
    const row = await this.db
      .selectFrom('IndexerState')
      .selectAll()
      .where('indexerId', '=', indexerId)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async updateSafeHeight(
    indexerId: string,
    safeHeight: number,
  ): Promise<number> {
    const result = await this.db
      .updateTable('IndexerState')
      .set('safeHeight', safeHeight)
      .where('indexerId', '=', indexerId)
      .executeTakeFirst()
    return Number(result.numUpdatedRows)
  }

  async getAll(): Promise<IndexerStateRecord[]> {
    const rows = await this.db.selectFrom('IndexerState').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('IndexerState').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
