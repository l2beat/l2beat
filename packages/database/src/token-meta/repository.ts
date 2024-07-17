import { PostgresDatabase } from '../kysely'
import { TokenMetaRecord, toRow } from './entity'

export class TokenMetaRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsertMany(tokenMetas: TokenMetaRecord[]) {
    const entities = tokenMetas.map(toRow)

    return this.db
      .insertInto('public.TokenMeta')
      .values(entities)
      .onConflict((conflict) =>
        conflict.columns(['tokenId', 'source']).doUpdateSet({
          tokenId: (excluded) => excluded.ref('excluded.tokenId'),
          source: (excluded) => excluded.ref('excluded.source'),
        }),
      )
      .returning('public.TokenMeta.id')
      .execute()
  }
}
