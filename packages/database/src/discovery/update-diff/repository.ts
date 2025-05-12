import { BaseRepository } from '../../BaseRepository'
import { type UpdateDiffRecord, toRecord, toRow } from './entity'

export class UpdateDiffRepository extends BaseRepository {
  async insertMany(records: UpdateDiffRecord[]): Promise<number> {
    if (records.length === 0) return 0

    await this.db
      .insertInto('UpdateDiff')
      .onConflict((cb) => cb.columns(['address']).doNothing())
      .values(records.map(toRow))
      .execute()

    return records.length
  }

  async getAll() {
    const rows = await this.db.selectFrom('UpdateDiff').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('UpdateDiff').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
