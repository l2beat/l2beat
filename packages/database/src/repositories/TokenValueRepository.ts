import { UnixTime } from '@l2beat/shared-pure'
import type { ExpressionBuilder, Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { DB } from '../kysely'
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

  async getSummedByTimestampByProjects(
    projectIds: string[],
    fromInclusive: UnixTime | null,
    toInclusive: UnixTime | null,
    opts: {
      forSummary: boolean
      excludeAssociated: boolean
      includeRwaRestrictedTokens: boolean
    },
  ): Promise<
    {
      timestamp: UnixTime
      value: number
      canonical: number
      external: number
      native: number
      ether: number
      stablecoin: number
      btc: number
      rwaRestricted: number
      rwaPublic: number
      other: number
    }[]
  > {
    const valueField = opts.forSummary ? 'valueForSummary' : 'valueForProject'

    let query = this.db
      .selectFrom('TokenValue')
      .innerJoin('TokenMetadata', 'TokenValue.tokenId', 'TokenMetadata.tokenId')
      .select((eb) => [
        'TokenValue.timestamp',
        eb.cast(eb.fn.sum(valueField), 'double precision').as('value'),
        // Source breakdown
        sumBySource(eb, valueField, 'canonical'),
        sumBySource(eb, valueField, 'external'),
        sumBySource(eb, valueField, 'native'),
        // Category breakdown
        sumByCategory(eb, valueField, 'ether'),
        sumByCategory(eb, valueField, 'stablecoin'),
        sumByCategory(eb, valueField, 'btc'),
        sumByCategory(eb, valueField, 'rwaRestricted'),
        sumByCategory(eb, valueField, 'rwaPublic'),
        sumByCategory(eb, valueField, 'other'),
      ])
      .where('TokenValue.projectId', 'in', projectIds)
      .groupBy('TokenValue.timestamp')

    if (fromInclusive) {
      query = query.where('timestamp', '>=', UnixTime.toDate(fromInclusive))
    }

    if (toInclusive) {
      query = query.where('timestamp', '<=', UnixTime.toDate(toInclusive))
    }

    if (opts.excludeAssociated) {
      query = query.where('TokenMetadata.isAssociated', '=', false)
    }

    if (!opts.includeRwaRestrictedTokens) {
      query = query.where('TokenMetadata.category', '!=', 'rwaRestricted')
    }

    const rows = await query.execute()

    return rows.map((row) => ({
      timestamp: UnixTime.fromDate(row.timestamp),
      value: Number(row.value),
      canonical: Number(row.canonical),
      external: Number(row.external),
      native: Number(row.native),
      ether: Number(row.ether),
      stablecoin: Number(row.stablecoin),
      btc: Number(row.btc),
      rwaRestricted: Number(row.rwaRestricted),
      rwaPublic: Number(row.rwaPublic),
      other: Number(row.other),
    }))
  }

  async getSummedAtTimestampsByProjects(
    oldestTimestamp: number,
    latestTimestamp: number,
    opts: {
      excludeAssociated: boolean
      includeRwaRestrictedTokens: boolean
      cutOffTimestamp?: number
    },
  ): Promise<
    {
      timestamp: UnixTime
      project: string
      value: number
      canonical: number
      external: number
      native: number
      ether: number
      stablecoin: number
      btc: number
      rwaRestricted: number
      rwaPublic: number
      other: number
      associated: number
    }[]
  > {
    const valueField = 'valueForProject'

    let query = this.db
      .selectFrom('TokenValue')
      .innerJoin('TokenMetadata', 'TokenValue.tokenId', 'TokenMetadata.tokenId')
      .select((eb) => [
        'TokenValue.projectId',
        'TokenValue.timestamp',
        eb.cast(eb.fn.sum(valueField), 'double precision').as('value'),
        // Source breakdown
        sumBySource(eb, valueField, 'canonical'),
        sumBySource(eb, valueField, 'external'),
        sumBySource(eb, valueField, 'native'),
        // Category breakdown
        sumByCategory(eb, valueField, 'ether'),
        sumByCategory(eb, valueField, 'stablecoin'),
        sumByCategory(eb, valueField, 'btc'),
        sumByCategory(eb, valueField, 'rwaRestricted'),
        sumByCategory(eb, valueField, 'rwaPublic'),
        sumByCategory(eb, valueField, 'other'),
        eb.fn
          .sum(
            eb
              .case()
              .when('TokenMetadata.isAssociated', '=', true)
              .then(eb.ref(valueField))
              .else(eb.cast(eb.val(0), 'double precision'))
              .end(),
          )
          .as('associated'),
      ])
      .where('timestamp', 'in', [
        UnixTime.toDate(oldestTimestamp),
        UnixTime.toDate(latestTimestamp),
      ])
      .where(
        'timestamp',
        '>=',
        opts.cutOffTimestamp
          ? UnixTime.toDate(opts.cutOffTimestamp)
          : sql<Date>`NOW() - INTERVAL '30 days'`,
      )
      .groupBy(['TokenValue.timestamp', 'TokenValue.projectId'])

    if (opts.excludeAssociated) {
      query = query.where('TokenMetadata.isAssociated', '=', false)
    }

    if (!opts.includeRwaRestrictedTokens) {
      query = query.where('TokenMetadata.category', '!=', 'rwaRestricted')
    }

    const rows = await query.execute()

    return rows.map((row) => ({
      project: row.projectId,
      timestamp: UnixTime.fromDate(row.timestamp),
      value: Number(row.value),
      canonical: Number(row.canonical),
      external: Number(row.external),
      native: Number(row.native),
      ether: Number(row.ether),
      stablecoin: Number(row.stablecoin),
      btc: Number(row.btc),
      rwaRestricted: Number(row.rwaRestricted),
      rwaPublic: Number(row.rwaPublic),
      other: Number(row.other),
      associated: Number(row.associated),
    }))
  }

  async checkIfExists(
    projectId: string,
    fromInclusive?: UnixTime,
  ): Promise<boolean> {
    let query = this.db
      .selectFrom('TokenValue')
      .select('projectId')
      .where('projectId', '=', projectId)
      .limit(1)

    if (fromInclusive) {
      query = query.where('timestamp', '>=', UnixTime.toDate(fromInclusive))
    }

    const result = await query.executeTakeFirst()
    return result !== undefined
  }
}

function sumByCategory(
  eb: ExpressionBuilder<DB, 'TokenValue' | 'TokenMetadata'>,
  valueField: 'valueForProject' | 'valueForSummary',
  category: TokenCategory,
) {
  return eb.fn
    .sum(
      eb
        .case()
        .when('TokenMetadata.category', '=', category)
        .then(eb.ref(valueField))
        .else(eb.cast(eb.val(0), 'double precision'))
        .end(),
    )
    .as(category)
}

function sumBySource(
  eb: ExpressionBuilder<DB, 'TokenValue' | 'TokenMetadata'>,
  valueField: 'valueForProject' | 'valueForSummary',
  source: TokenSource,
) {
  return eb.fn
    .sum(
      eb
        .case()
        .when('TokenMetadata.source', '=', source)
        .then(eb.ref(valueField))
        .else(eb.cast(eb.val(0), 'double precision'))
        .end(),
    )
    .as(source)
}
