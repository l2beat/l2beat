import { BaseRepository } from '../../BaseRepository'
import { TokenBridgeRecord, toRow } from './entity'

export class TokenBridgeRepository extends BaseRepository {
  async upsertMany(records: TokenBridgeRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('TokenBridge')
        .values(batch)
        .onConflict((cb) =>
          cb.doUpdateSet((eb) => ({
            sourceTokenId: eb.ref('excluded.sourceTokenId'),
            targetTokenId: eb.ref('excluded.targetTokenId'),
            externalBridgeId: eb.ref('excluded.externalBridgeId'),
          })),
        )
        .execute()
    })
    return records.length
  }
}
