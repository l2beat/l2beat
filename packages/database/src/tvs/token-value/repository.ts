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

  async getByTokenIdInTimeRange(
    tokenId: string,
    fromInclusive: UnixTime | null,
    toInclusive: UnixTime | null,
  ): Promise<TokenValueRecord[]> {
    let query = this.db
      .selectFrom('TokenValue')
      .selectAll()
      .where('tokenId', '=', tokenId)

    if (fromInclusive) {
      query = query.where('timestamp', '>=', UnixTime.toDate(fromInclusive))
    }

    if (toInclusive) {
      query = query.where('timestamp', '<=', UnixTime.toDate(toInclusive))
    }

    const rows = await query.orderBy('timestamp', 'asc').execute()

    return rows.map(toRecord)
  }

  async getByProjectAtOrBefore(
    project: string,
    timestamp: UnixTime,
  ): Promise<TokenValueRecord[]> {
    const subquery = this.db
      .selectFrom('TokenValue')
      .select(['tokenId'])
      .select(this.db.fn.max('timestamp').as('maxTimestamp'))
      .where('projectId', '=', project)
      .where('timestamp', '<=', UnixTime.toDate(timestamp))
      .groupBy(['tokenId'])
      .as('latest')

    const rows = await this.db
      .selectFrom('TokenValue')
      .innerJoin(subquery, (join) =>
        join
          .onRef('TokenValue.tokenId', '=', 'latest.tokenId')
          .onRef('TokenValue.timestamp', '=', 'latest.maxTimestamp'),
      )
      .where('TokenValue.projectId', '=', project)
      .selectAll('TokenValue')
      .execute()

    return rows.map(toRecord)
  }

  async getLastNonZeroValue(
    timestamp: UnixTime,
    project?: string,
  ): Promise<TokenValueRecord[]> {
    let subquery = this.db
      .selectFrom('TokenValue')
      .select(['tokenId'])
      .select(this.db.fn.max('timestamp').as('maxTimestamp'))
      .where('value', '>', 0)
      .where('timestamp', '<=', UnixTime.toDate(timestamp))

    if (project) {
      subquery = subquery.where('projectId', '=', project)
    }

    const latest = subquery.groupBy(['tokenId']).as('latest')

    const rows = await this.db
      .selectFrom('TokenValue')
      .innerJoin(latest, (join) =>
        join
          .onRef('TokenValue.tokenId', '=', 'latest.tokenId')
          .onRef('TokenValue.timestamp', '=', 'latest.maxTimestamp'),
      )
      .selectAll('TokenValue')
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
