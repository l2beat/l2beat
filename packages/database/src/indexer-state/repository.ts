import { PostgresDatabase, Transaction } from '../kysely'
import { IndexerStateRecord, toRecord, toRow } from './entity'

export class IndexerStateRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdate(
    record: IndexerStateRecord,
    trx?: Transaction,
  ): Promise<string> {
    const row = toRow(record)
    const scope = trx ?? this.db
    await scope
      .insertInto('public.indexer_state')
      .values(row)
      .onConflict((cb) =>
        cb.column('indexer_id').doUpdateSet((eb) => ({
          safe_height: eb.ref('excluded.safe_height'),
          config_hash: eb.ref('excluded.config_hash'),
          min_timestamp: eb.ref('excluded.min_timestamp'),
        })),
      )
      .execute()

    return `[${record.indexerId}]: ${record.safeHeight}`
  }

  async getByIndexerIds(ids: string[]) {
    if (ids.length === 0) {
      return []
    }

    const rows = await this.db
      .selectFrom('public.indexer_state')
      .selectAll()
      .where('indexer_id', 'in', ids)
      .execute()

    return rows.map(toRecord)
  }

  async findIndexerState(indexerId: string) {
    const row = await this.db
      .selectFrom('public.indexer_state')
      .selectAll()
      .where('indexer_id', '=', indexerId)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async setSafeHeight(
    indexerId: string,
    safeHeight: number,
    trx?: Transaction,
  ) {
    const scope = trx ?? this.db

    const [result] = await scope
      .updateTable('public.indexer_state')
      .set({ safe_height: safeHeight })
      .where('indexer_id', '=', indexerId)
      .execute()

    return Number(result?.numUpdatedRows ?? 0)
  }

  async getAll() {
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
