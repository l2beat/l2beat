import { BaseRepository } from '../../BaseRepository'
import { CacheRecord, UpsertableCacheRecord, upsertableToRow } from './entity'
import { selectCache } from './select'

export class CacheRepository extends BaseRepository {
  async upsert(record: UpsertableCacheRecord): Promise<void> {
    const row = upsertableToRow(record)
    await this.db
      .insertInto('Cache')
      .values(row)
      .onConflict((cb) =>
        cb.doUpdateSet((eb) => ({
          value: eb.ref('excluded.value'),
          chainId: eb.ref('excluded.chainId'),
          key: eb.ref('excluded.key'),
          blockNumber: eb.ref('excluded.blockNumber'),
        })),
      )
      .execute()
  }

  async findByKey(key: string): Promise<CacheRecord | undefined> {
    const row = await this.db
      .selectFrom('Cache')
      .select(selectCache)
      .where('Cache.key', '=', key)
      .limit(1)
      .executeTakeFirst()
    return row
  }
}
