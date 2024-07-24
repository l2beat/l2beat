import { BaseRepository } from '../../BaseRepository'
import { TokenBridgeRecord, toRow } from './entity'

export class TokenBridgeRepository extends BaseRepository {
  upsertMany(tokenBridges: TokenBridgeRecord[]) {
    const rows = tokenBridges.map(toRow)
    return this.getDb()
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
