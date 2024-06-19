import { PostgresDatabase } from '../kysely'
import { Cache, toRecord, toRow } from './entity'
import { selectCache } from './select'

export class CacheRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsert(cache: Cache) {
    const row = toRow(cache)

    return this.db
      .insertInto('public.Cache')
      .values(row)
      .onConflict((conflict) =>
        conflict.doUpdateSet({
          value: (excluded) => excluded.ref('excluded.value'),
          chainId: (excluded) => excluded.ref('excluded.chainId'),
          key: (excluded) => excluded.ref('excluded.key'),
          blockNumber: (excluded) => excluded.ref('excluded.blockNumber'),
        }),
      )
      .execute()
  }

  async findByKey(key: Cache['key']) {
    const row = await this.db
      .selectFrom('public.Cache')
      .select(selectCache)
      .where('public.Cache.key', '=', key)
      .executeTakeFirst()

    return row ? toRecord(row) : null
  }
}
