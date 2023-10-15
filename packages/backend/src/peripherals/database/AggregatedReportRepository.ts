import { Logger } from '@l2beat/backend-tools'
import {
  AggregatedReportType,
  assert,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { AggregatedReportRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface AggregatedReportRecord {
  timestamp: UnixTime
  projectId: ProjectId
  usdValue: bigint
  ethValue: bigint
  reportType: AggregatedReportType
}

interface CombinedAggregatedRow {
  unix_timestamp: Date
  cbv_usd_value: bigint
  cbv_eth_value: bigint
  ebv_usd_value: bigint
  ebv_eth_value: bigint
  nmv_usd_value: bigint
  nmv_eth_value: bigint
  tvl_usd_value: bigint
  tvl_eth_value: bigint
}

interface CombinedAggregatedRecord {
  timestamp: UnixTime
  cbvUsdValue: bigint
  cbvEthValue: bigint
  ebvUsdValue: bigint
  ebvEthValue: bigint
  nmvUsdValue: bigint
  nmvEthValue: bigint
  tvlUsdValue: bigint
  tvlEthValue: bigint
}

export class AggregatedReportRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<AggregatedReportRepository>>(this)
  }
  async getDaily(
    reportType: AggregatedReportType,
  ): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .andWhere({ report_type: reportType })
      .andWhereRaw(`EXTRACT(hour FROM unix_timestamp) = 0`)
      .orderBy('unix_timestamp')
    return rows.map(toRecord)
  }

  async getDailyWithAnyType(): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .whereRaw(`EXTRACT(hour FROM unix_timestamp) = 0`)
      .orderBy('unix_timestamp')
    return rows.map(toRecord)
  }

  async getSixHourly(
    from: UnixTime,
    reportType: AggregatedReportType,
  ): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .where('unix_timestamp', '>=', from.toDate())
      .andWhere({ report_type: reportType })
      .andWhereRaw(`EXTRACT(hour FROM unix_timestamp) % 6 = 0`)
      .orderBy('unix_timestamp')
    return rows.map(toRecord)
  }

  async getSixHourlyWithAnyType(
    from: UnixTime,
  ): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .where('unix_timestamp', '>=', from.toDate())
      .andWhereRaw(`EXTRACT(hour FROM unix_timestamp) % 6 = 0`)
      .orderBy('unix_timestamp')
    return rows.map(toRecord)
  }

  async getHourly(
    from: UnixTime,
    reportType: AggregatedReportType,
  ): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .where('unix_timestamp', '>=', from.toDate())
      .andWhere({ report_type: reportType })
      .orderBy('unix_timestamp')
    return rows.map(toRecord)
  }

  async getHourlyWithAnyType(
    from: UnixTime,
  ): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .where('unix_timestamp', '>=', from.toDate())
      .orderBy('unix_timestamp')
    return rows.map(toRecord)
  }

  async getAggregateHourly(projectIds: ProjectId[], from: UnixTime) {
    const knex = await this.knex()

    const rows = (await knex('aggregated_reports')
      .select('unix_timestamp')
      .select(AGGREGATED_SUM_QUERIES.map((q) => knex.raw(q)))
      .whereIn('project_id', projectIds)
      .where('unix_timestamp', '>=', from.toDate())
      .groupBy('unix_timestamp')
      .orderBy('unix_timestamp', 'asc')) as unknown as CombinedAggregatedRow[]

    return rows.map((row) => toAggregatedRow(row))
  }

  async getAggregateSixHourly(projectIds: ProjectId[], from: UnixTime) {
    const knex = await this.knex()

    const rows = (await knex('aggregated_reports')
      .select('unix_timestamp')
      .select(AGGREGATED_SUM_QUERIES.map((q) => knex.raw(q)))
      .whereIn('project_id', projectIds)
      .where('unix_timestamp', '>=', from.toDate())
      .whereRaw('EXTRACT(hour FROM unix_timestamp) % 6 = 0')
      .groupBy('unix_timestamp')
      .orderBy('unix_timestamp', 'asc')) as unknown as CombinedAggregatedRow[]

    return rows.map((row) => toAggregatedRow(row))
  }

  async getAggregateDaily(projectIds: ProjectId[]) {
    const knex = await this.knex()

    const rows = (await knex('aggregated_reports')
      .select('unix_timestamp')
      .select(AGGREGATED_SUM_QUERIES.map((q) => knex.raw(q)))
      .whereIn('project_id', projectIds)
      .whereRaw('EXTRACT(hour FROM unix_timestamp) = 0')
      .groupBy('unix_timestamp')
      .orderBy('unix_timestamp', 'asc')) as unknown as CombinedAggregatedRow[]

    return rows.map((row) => toAggregatedRow(row))
  }

  async getAll(): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports').select()
    return rows.map(toRecord)
  }

  async findLatest(
    projectId: ProjectId,
    reportType: AggregatedReportType,
  ): Promise<AggregatedReportRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('aggregated_reports')
      .select()
      .where({
        project_id: projectId.toString(),
        report_type: reportType,
      })
      .orderBy('unix_timestamp', 'desc')
      .first()

    return row ? toRecord(row) : undefined
  }

  async addOrUpdateMany(reports: AggregatedReportRecord[]) {
    const rows = reports.map(toRow)
    const knex = await this.knex()
    const timestampsMatch = reports.every((r) =>
      r.timestamp.equals(reports[0].timestamp),
    )
    assert(timestampsMatch, 'Timestamps must match')

    await knex.transaction(async (trx) => {
      await trx('aggregated_reports')
        .where('unix_timestamp', rows[0].unix_timestamp)
        .delete()
      await trx('aggregated_reports')
        .insert(rows)
        .onConflict(['unix_timestamp', 'project_id', 'report_type'])
        .merge()
    })
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('aggregated_reports').delete()
  }
}

function toRow(record: AggregatedReportRecord): AggregatedReportRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    usd_value: record.usdValue.toString(),
    eth_value: record.ethValue.toString(),
    report_type: record.reportType,
  }
}

function toRecord(row: AggregatedReportRow): AggregatedReportRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    usdValue: BigInt(row.usd_value),
    ethValue: BigInt(row.eth_value),
    reportType: AggregatedReportType(row.report_type),
  }
}

function toAggregatedRow(row: CombinedAggregatedRow): CombinedAggregatedRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    cbvUsdValue: BigInt(row.cbv_usd_value),
    cbvEthValue: BigInt(row.cbv_eth_value),
    ebvUsdValue: BigInt(row.ebv_usd_value),
    ebvEthValue: BigInt(row.ebv_eth_value),
    nmvUsdValue: BigInt(row.nmv_usd_value),
    nmvEthValue: BigInt(row.nmv_eth_value),
    tvlUsdValue: BigInt(row.tvl_usd_value),
    tvlEthValue: BigInt(row.tvl_eth_value),
  }
}

const AGGREGATED_SUM_QUERIES = [
  "SUM(CASE WHEN report_type = 'CBV' THEN usd_value ELSE 0 END) as cbv_usd_value",
  "SUM(CASE WHEN report_type = 'CBV' THEN eth_value ELSE 0 END) as cbv_eth_value",
  "SUM(CASE WHEN report_type = 'EBV' THEN usd_value ELSE 0 END) as ebv_usd_value",
  "SUM(CASE WHEN report_type = 'EBV' THEN eth_value ELSE 0 END) as ebv_eth_value",
  "SUM(CASE WHEN report_type = 'NMV' THEN usd_value ELSE 0 END) as nmv_usd_value",
  "SUM(CASE WHEN report_type = 'NMV' THEN eth_value ELSE 0 END) as nmv_eth_value",
  "SUM(CASE WHEN report_type = 'TVL' THEN usd_value ELSE 0 END) as tvl_usd_value",
  "SUM(CASE WHEN report_type = 'TVL' THEN eth_value ELSE 0 END) as tvl_eth_value",
]
