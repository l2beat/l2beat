import { Insertable } from 'kysely'
import { PostgresDatabase } from '../../kysely'
import { TokenBridge } from '../../kysely/generated/types'

export class TokenBridgeRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsertMany(data: Insertable<TokenBridge>[]) {
    return this.db
      .insertInto('TokenBridge')
      .values(data)
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
