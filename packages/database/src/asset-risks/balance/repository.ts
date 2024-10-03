import { BaseRepository } from '../../BaseRepository'
import {
  AssetRisksBalanceRecord,
  UpsertableAssetRisksBalanceRecord,
  upsertableToRecord,
} from './entity'
import { selectAssetRisksBalance } from './select'

export class AssetRisksBalanceRepository extends BaseRepository {
  async getAllForUser(userId: string): Promise<AssetRisksBalanceRecord[]> {
    const rows = await this.db
      .selectFrom('AssetRisksBalance')
      .select(selectAssetRisksBalance)
      .where('userId', '=', userId)
      .execute()
    return rows
  }

  async upsertMany(
    records: UpsertableAssetRisksBalanceRecord[],
  ): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(upsertableToRecord)
    await this.db
      .insertInto('AssetRisksBalance')
      .values(rows)
      .onConflict((oc) =>
        oc.columns(['tokenId', 'userId']).doUpdateSet((eb) => ({
          balance: eb.ref('excluded.balance'),
          updatedAt: eb.ref('excluded.updatedAt'),
        })),
      )
      .execute()
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AssetRisksBalance')
      .executeTakeFirstOrThrow()
    return Number(result.numDeletedRows)
  }
}
