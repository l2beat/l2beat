import { Insertable } from 'kysely'
import { PostgresDatabase } from '../../kysely'
import { Cache } from '../../kysely/generated/types'

export class CacheRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsert(data: Insertable<Cache>[]) {
    return this.db
      .insertInto('Cache')
      .values(data)
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

  findById(constraints: { id: string }) {
    return this.db
      .selectFrom('Cache')
      .where('Cache.key', '=', constraints.id)
      .execute()
  }
}
