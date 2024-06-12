import { PostgresDatabase } from '../kysely'
import { TokenBridge, toEntity } from './entity'

export class TokenBridgeRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsertMany(tokenBridges: TokenBridge[]) {
    const entities = tokenBridges.map(toEntity)
    return this.db
      .insertInto('token_bridge')
      .values(entities)
      .onConflict((conflict) =>
        conflict.doUpdateSet({
          source_token_id: (excluded) =>
            excluded.ref('excluded.source_token_id'),
          target_token_id: (excluded) =>
            excluded.ref('excluded.target_token_id'),
          external_bridge_id: (excluded) =>
            excluded.ref('excluded.external_bridge_id'),
        }),
      )
      .execute()
  }
}
