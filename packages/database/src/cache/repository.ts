import { PostgresDatabase } from '../kysely'
import { Cache, fromEntity, toEntity } from './entity'

export class CacheRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsert(cache: Cache) {
    const entity = toEntity(cache)

    return this.db
      .insertInto('cache')
      .values(entity)
      .onConflict((conflict) =>
        conflict.doUpdateSet({
          value: (excluded) => excluded.ref('excluded.value'),
          chain_id: (excluded) => excluded.ref('excluded.chain_id'),
          key: (excluded) => excluded.ref('excluded.key'),
          block_number: (excluded) => excluded.ref('excluded.block_number'),
        }),
      )
      .execute()
  }

  async findByKey(key: Cache['key']) {
    const row = await this.db
      .selectFrom('cache')
      .selectAll()
      .where('cache.key', '=', key)
      .executeTakeFirst()

    return row ? fromEntity(row) : null
  }
}
