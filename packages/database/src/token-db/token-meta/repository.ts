import { Insertable } from 'kysely'
import { PostgresDatabase } from '../../kysely'
import { TokenMeta } from '../../kysely/generated/types'

export class TokenMetaRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsertMany(data: Insertable<TokenMeta>[]) {
    return this.db
      .insertInto('TokenMeta')
      .values(data)
      .onConflict((conflict) =>
        conflict.columns(['tokenId', 'source']).doUpdateSet({
          tokenId: (excluded) => excluded.ref('excluded.tokenId'),
          source: (excluded) => excluded.ref('excluded.source'),
        }),
      )
      .returning('TokenMeta.id')
      .execute()
  }
}
