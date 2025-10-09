import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenValue } from '../kysely/generated/types'
import type { TokenCategory, TokenSource } from './TokenMetadataRepository'

export interface TokenValueRecord {
  timestamp: UnixTime
  configurationId: string
  projectId: string
  tokenId: string
  amount: number
  value: number
  valueForProject: number
  valueForSummary: number
  priceUsd: number
}

export function toRecord(row: Selectable<TokenValue>): TokenValueRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: TokenValueRecord): Insertable<TokenValue> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

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

  async getAtOrBefore(timestamp: UnixTime): Promise<TokenValueRecord[]> {
    const latestPerToken = this.db
      .selectFrom('TokenValue')
      .select(['tokenId'])
      .select(this.db.fn.max('timestamp').as('maxTimestamp'))
      .where('timestamp', '<=', UnixTime.toDate(timestamp))
      .groupBy(['tokenId'])
      .as('latest')

    const rows = await this.db
      .selectFrom('TokenValue')
      .innerJoin(latestPerToken, (join) =>
        join
          .onRef('TokenValue.tokenId', '=', 'latest.tokenId')
          .onRef('TokenValue.timestamp', '=', 'latest.maxTimestamp'),
      )
      .selectAll('TokenValue')
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

  async getTvsChartBySource(projectIds: string[]): Promise<
    {
      timestamp: string
      source: string
      value: string | number | bigint
    }[]
  > {
    const timePart = sql`${sql.ref('TokenValue.timestamp')}::time`

    const rows = await this.db
      .selectFrom('TokenValue')
      .innerJoin('TokenMetadata', 'TokenValue.tokenId', 'TokenMetadata.tokenId')
      .select([
        'TokenValue.timestamp',
        'TokenMetadata.source',
        this.db.fn.sum('valueForSummary').as('value'),
      ])
      .where(timePart, '=', sql`'00:00:00'::time`)
      .where(
        'timestamp',
        '>=',
        UnixTime.toDate(UnixTime.now() - UnixTime.DAY * 365),
      )
      .where('TokenMetadata.projectId', 'in', projectIds)
      .groupBy(['TokenValue.timestamp', 'TokenMetadata.source'])
      .orderBy('TokenValue.timestamp', 'desc')
      .execute()

    return rows.map((row) => ({
      timestamp: row.timestamp.toISOString(),
      source: row.source,
      value: row.value,
    }))
  }

  async getByProjects(
    projectIds: string[],
    fromInclusive: UnixTime | null,
    toInclusive: UnixTime | null,
    excludeAssociated: boolean,
  ): Promise<
    {
      timestamp: UnixTime
      source: TokenSource
      category: TokenCategory
      valueForProject: number
      valueForSummary: number
    }[]
  > {
    let query = this.db
      .selectFrom('TokenValue')
      .innerJoin('TokenMetadata', 'TokenValue.tokenId', 'TokenMetadata.tokenId')
      .select([
        'TokenValue.timestamp',
        'TokenMetadata.source',
        'TokenMetadata.category',
        'TokenValue.valueForProject',
        'TokenValue.valueForSummary',
      ])
      .where('TokenValue.projectId', 'in', projectIds)

    if (fromInclusive) {
      query = query.where('timestamp', '>=', UnixTime.toDate(fromInclusive))
    }

    if (toInclusive) {
      query = query.where('timestamp', '<=', UnixTime.toDate(toInclusive))
    }

    if (excludeAssociated) {
      query = query.where('TokenMetadata.isAssociated', '=', false)
    }

    const rows = await query.execute()

    return rows.map((row) => ({
      timestamp: UnixTime.fromDate(row.timestamp),
      source: row.source as TokenSource,
      category: row.category as TokenCategory,
      valueForProject: row.valueForProject,
      valueForSummary: row.valueForSummary,
    }))
  }

  async getTvsTableBySource(
    projectIds: string[],
    depth: number,
  ): Promise<
    {
      projectId: string
      source: string
      value: string | number | bigint
    }[]
  > {
    const lt = this.db
      .selectFrom('TokenValue')
      .select(['tokenId', this.db.fn.max('timestamp').as('maxTimestamp')])
      .where('projectId', 'in', projectIds)
      .where('timestamp', '>=', UnixTime.toDate(depth))
      .groupBy(['tokenId'])
      .as('lt')

    const rows = await this.db
      .selectFrom('TokenMetadata')
      .innerJoin(lt, 'lt.tokenId', 'TokenMetadata.tokenId')
      .innerJoin('TokenValue', (join) =>
        join
          .onRef('TokenValue.tokenId', '=', 'TokenMetadata.tokenId')
          .onRef('TokenValue.timestamp', '=', 'lt.maxTimestamp'),
      )
      .select([
        'TokenMetadata.projectId',
        'TokenMetadata.source',
        this.db.fn.sum('TokenValue.valueForSummary').as('value'),
      ])
      .where('TokenMetadata.projectId', 'in', projectIds)
      .where('timestamp', '>=', UnixTime.toDate(depth))
      .groupBy(['TokenMetadata.projectId', 'TokenMetadata.source'])
      .orderBy(['TokenMetadata.projectId', 'TokenMetadata.source'])
      .execute()

    return rows.map((row) => ({
      projectId: row.projectId,
      source: row.source,
      value: row.value,
    }))
  }
}
