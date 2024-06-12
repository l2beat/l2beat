import { PostgresDatabase } from '../kysely'
import { TokenMeta, toEntity } from './entity'

export class TokenMetaRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsertMany(tokenMetas: TokenMeta[]) {
    const entities = tokenMetas.map(toEntity)

    return this.db
      .insertInto('token_meta')
      .values(entities)
      .onConflict((conflict) =>
        conflict.columns(['token_id', 'source']).doUpdateSet({
          token_id: (excluded) => excluded.ref('excluded.token_id'),
          source: (excluded) => excluded.ref('excluded.source'),
        }),
      )
      .returning('token_meta.id')
      .execute()
  }
}
