import { BaseRepository } from '../../BaseRepository'
import { type RealTimeLivenessRecord, toRecord, toRow } from './entity'

export class RealTimeLivenessRepository extends BaseRepository {
  async getAll(): Promise<RealTimeLivenessRecord[]> {
    const rows = await this.db
      .selectFrom('RealTimeLiveness')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async insertMany(records: RealTimeLivenessRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('RealTimeLiveness').values(batch).execute()
    })
    return rows.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('RealTimeLiveness')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getLatestRecords(): Promise<RealTimeLivenessRecord[]> {
    const subQuery = this.db
      .selectFrom('RealTimeLiveness')
      .select([
        'configurationId',
        this.db.fn.max('timestamp').as('maxTimestamp'),
      ])
      .groupBy('configurationId')

    const rows = await this.db
      .selectFrom('RealTimeLiveness as rtl')
      .innerJoin(subQuery.as('latest'), (join) =>
        join
          .onRef('rtl.configurationId', '=', 'latest.configurationId')
          .onRef('rtl.timestamp', '=', 'latest.maxTimestamp'),
      )
      .selectAll('rtl')
      .execute()

    return rows.map(toRecord)
  }
}
