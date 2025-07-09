import { BaseRepository } from '../../BaseRepository'
import { type StakeRecord, toRecord, toRow } from './entity'

export class StakeRepository extends BaseRepository {
  async getAll(): Promise<StakeRecord[]> {
    const rows = await this.db.selectFrom('Stake').selectAll().execute()
    return rows.map(toRecord)
  }

  async findById(id: string): Promise<StakeRecord | undefined> {
    const row = await this.db
      .selectFrom('Stake')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getByIds(ids: string[]): Promise<StakeRecord[]> {
    if (ids.length === 0) return []

    const res = await this.db
      .selectFrom('Stake')
      .selectAll()
      .where('id', 'in', ids)
      .execute()
    return res.map(toRecord)
  }

  async upsert(record: StakeRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: StakeRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1000, async (batch) => {
      await this.db
        .insertInto('Stake')
        .values(batch)
        .onConflict((oc) =>
          oc.columns(['id']).doUpdateSet((eb) => ({
            thresholdStake: eb.ref('excluded.thresholdStake'),
            totalStake: eb.ref('excluded.totalStake'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Stake').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
