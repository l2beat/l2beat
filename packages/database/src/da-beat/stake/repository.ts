import { BaseRepository } from '../../BaseRepository'
import { StakeRecord, toRecord, toRow } from './entity'
import { selectStake } from './select'

export class StakeRepository extends BaseRepository {
  async getAll(): Promise<StakeRecord[]> {
    const rows = await this.db
      .selectFrom('public.Stake')
      .select(selectStake)
      .execute()
    return rows.map(toRecord)
  }

  async findById(id: string): Promise<StakeRecord | undefined> {
    const row = await this.db
      .selectFrom('public.Stake')
      .select(selectStake)
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getByIds(ids: string[]): Promise<StakeRecord[]> {
    if (ids.length === 0) {
      return []
    }
    const res = await this.db
      .selectFrom('public.Stake')
      .select(selectStake)
      .where('id', 'in', ids)
      .execute()
    return res.map(toRecord)
  }

  async addOrUpdate(stake: StakeRecord): Promise<void> {
    const row = toRow(stake)
    await this.db
      .insertInto('public.Stake')
      .values(row)
      .onConflict((oc) =>
        oc.columns(['id']).doUpdateSet((eb) => ({
          thresholdStake: eb.ref('excluded.thresholdStake'),
          totalStake: eb.ref('excluded.totalStake'),
        })),
      )
      .execute()
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('public.Stake').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
