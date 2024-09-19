import { BaseRepository } from '../../BaseRepository'
import {
  TokenBridgeRecord,
  UpsertableTokenBridgeRecord,
  upsertableToRecord,
} from './entity'
import { selectTokenBridge } from './select'

export class TokenBridgeRepository extends BaseRepository {
  async getAll(): Promise<TokenBridgeRecord[]> {
    const rows = await this.db
      .selectFrom('TokenBridge')
      .select(selectTokenBridge)
      .execute()
    return rows
  }

  async upsertMany(records: UpsertableTokenBridgeRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(upsertableToRecord)
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
