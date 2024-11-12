import { BaseRepository } from '../../BaseRepository'
import {
  InsightBalanceRecord,
  UpsertableInsightBalanceRecord,
  upsertableToRecord,
} from './entity'
import { selectInsightBalance } from './select'

export class InsightBalanceRepository extends BaseRepository {
  async getAllForUser(userId: string): Promise<InsightBalanceRecord[]> {
    const rows = await this.db
      .selectFrom('InsightBalance')
      .select(selectInsightBalance)
      .where('userId', '=', userId)
      .execute()
    return rows
  }

  async upsertMany(records: UpsertableInsightBalanceRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(upsertableToRecord)
    await this.db
      .insertInto('InsightBalance')
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
      .deleteFrom('InsightBalance')
      .executeTakeFirstOrThrow()
    return Number(result.numDeletedRows)
  }
}
