import { BaseRepository } from '../../BaseRepository'
import { CacheRecord, toRecord, toRow } from './entity'
import { selectCache } from './select'

export class CacheRepository extends BaseRepository {
  upsert(cache: CacheRecord) {
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

  async findByKey(key: CacheRecord['key']) {
    const row = await this.db
      .selectFrom('public.Cache')
      .select(selectCache)
      .where('public.Cache.key', '=', key)
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : null
  }
}
