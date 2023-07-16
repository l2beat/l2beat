import { Logger } from '@l2beat/shared'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { AggregatedReportRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface AggregatedReportRecord {
  timestamp: UnixTime
  projectId: ProjectId
  tvlUsd: bigint
  tvlEth: bigint
}

export class AggregatedReportRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<AggregatedReportRepository>>(this)
  }

  async getDaily(): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .where('is_daily', true)
      .orderBy('unix_timestamp')
    return rows.map(toRecord)
  }

  async getSixHourly(from: UnixTime): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .where('is_six_hourly', true)
      .andWhere('unix_timestamp', '>=', from.toDate())
      .orderBy('unix_timestamp')
    return rows.map(toRecord)
  }

  async getHourly(from: UnixTime): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .andWhere('unix_timestamp', '>=', from.toDate())
      .orderBy('unix_timestamp')
    return rows.map(toRecord)
  }

  async getAll(): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports').select()
    return rows.map(toRecord)
  }

  async findLatest(
    projectId: ProjectId,
  ): Promise<AggregatedReportRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('aggregated_reports')
      .select()
      .where({ project_id: projectId.toString() })
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
        .onConflict(['unix_timestamp', 'project_id'])
        .merge()
    })
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('aggregated_reports').delete()
  }
}

function toRow(record: AggregatedReportRecord): AggregatedReportRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    tvl_usd: record.tvlUsd.toString(),
    tvl_eth: record.tvlEth.toString(),
    is_daily: record.timestamp.toNumber() % 86400 === 0 ? true : false,
    is_six_hourly: record.timestamp.toNumber() % 21600 === 0 ? true : false,
  }
}

function toRecord(row: AggregatedReportRow): AggregatedReportRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    tvlUsd: BigInt(row.tvl_usd),
    tvlEth: BigInt(row.tvl_eth),
  }
}
