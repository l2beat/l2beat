import { Logger } from '@l2beat/shared'
import { assert, ProjectId, UnixTime, ValueType } from '@l2beat/shared-pure'
import { AggregatedReportRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface AggregatedReportRecord {
  timestamp: UnixTime
  projectId: ProjectId
  usdValue: bigint
  ethValue: bigint
  valueType: ValueType
}

export class AggregatedReportRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<AggregatedReportRepository>>(this)
  }

  async getDaily(): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .where({ value_type: ValueType.TVL.toString() })
      .andWhereRaw(`EXTRACT(hour FROM unix_timestamp) = 0`)
      .orderBy('unix_timestamp')
    return rows.map(toRecord)
  }

  async getSixHourly(from: UnixTime): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .where('unix_timestamp', '>=', from.toDate())
      .andWhere({ value_type: ValueType.TVL.toString() })
      .andWhereRaw(`EXTRACT(hour FROM unix_timestamp) % 6 = 0`)
      .orderBy('unix_timestamp')
    return rows.map(toRecord)
  }

  async getHourly(from: UnixTime): Promise<AggregatedReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('aggregated_reports')
      .where('unix_timestamp', '>=', from.toDate())
      .andWhere({ value_type: ValueType.TVL.toString() })
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
      .where({
        project_id: projectId.toString(),
        value_type: ValueType.TVL.toString(),
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
        .onConflict(['unix_timestamp', 'project_id', 'value_type'])
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
    usd_value: record.usdValue.toString(),
    eth_value: record.ethValue.toString(),
    value_type: record.valueType.toString(),
  }
}

function toRecord(row: AggregatedReportRow): AggregatedReportRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    usdValue: BigInt(row.usd_value),
    ethValue: BigInt(row.eth_value),
    valueType: ValueType(row.value_type),
  }
}
