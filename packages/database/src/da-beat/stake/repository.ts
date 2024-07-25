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

  async upsert(record: StakeRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: StakeRecord[]): Promise<void> {
    const rows = records.map(toRow)
    await this.batch(rows, 1000, async (batch) => {
      await this.db
        .insertInto('public.Stake')
        .values(batch)
        .onConflict((oc) =>
          oc.columns(['id']).doUpdateSet((eb) => ({
            thresholdStake: eb.ref('excluded.thresholdStake'),
            totalStake: eb.ref('excluded.totalStake'),
          })),
        )
        .execute()
    })
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('public.Stake').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
