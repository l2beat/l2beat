import { BaseRepository } from '../../BaseRepository'
import { type ImplementationChangeRecord, toRecord, toRow } from './entity'

export class ImplementationChangeRepository extends BaseRepository {
  async insertMany(records: ImplementationChangeRecord[]): Promise<number> {
    if (records.length === 0) return 0

    await this.db
      .insertInto('ImplementationChange')
      .values(records.map(toRow))
      .execute()

    return records.length
  }

  async getAll() {
    const rows = await this.db
      .selectFrom('ImplementationChange')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('ImplementationChange')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
