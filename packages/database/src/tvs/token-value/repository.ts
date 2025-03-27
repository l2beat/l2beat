import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type TokenValueRecord, toRecord, toRow } from './entity'

export class TokenValueRepository extends BaseRepository {
  async insertMany(records: TokenValueRecord[]) {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('TokenValue').values(batch).execute()
    })
    return rows.length
  }

  async getByProject(
    project: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<TokenValueRecord[]> {
    const rows = await this.db
      .selectFrom('TokenValue')
      .selectAll()
      .where('projectId', '=', project)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .execute()

    return rows.map(toRecord)
  }

  async deleteByConfigInTimeRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenValue')
      .where('configurationId', '=', configurationId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<TokenValueRecord[]> {
    const rows = await this.db.selectFrom('TokenValue').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TokenValue').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
