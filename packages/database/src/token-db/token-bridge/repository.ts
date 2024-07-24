import { PostgresDatabase } from '../../kysely'
import { TokenBridgeRecord, toRow } from './entity'

export class TokenBridgeRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsertMany(tokenBridges: TokenBridgeRecord[]) {
    const rows = tokenBridges.map(toRow)
    return this.db
      .insertInto('public.TokenBridge')
      .values(rows)
      .onConflict((conflict) =>
        conflict.doUpdateSet({
          sourceTokenId: (excluded) => excluded.ref('excluded.sourceTokenId'),
          targetTokenId: (excluded) => excluded.ref('excluded.targetTokenId'),
          externalBridgeId: (excluded) =>
            excluded.ref('excluded.externalBridgeId'),
        }),
      )
      .execute()
  }
}
