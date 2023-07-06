import { Logger } from '@l2beat/shared'
import {
  assert,
  AssetId,
  ProjectId,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { ReportRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface ReportRecord {
  timestamp: UnixTime
  projectId: ProjectId
  asset: AssetId
  // TODO: Index this column when we start querying by it.
  type: ValueType
  amount: bigint
  usdValue: bigint
  ethValue: bigint
}

export const SIX_HOURS = UnixTime.HOUR * 6

export class ReportRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<ReportRepository>>(this)
  }

  async getByTimestamp(timestamp: UnixTime): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('reports').where(
      'unix_timestamp',
      timestamp.toDate(),
    )
    return rows.map(toRecord)
  }

  async getAll(): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('reports').select()
    return rows.map(toRecord)
  }

  async addOrUpdateMany(reports: ReportRecord[]) {
    const rows = reports.map(toRow)
    const knex = await this.knex()
    const timestampsMatch = reports.every((r) =>
      r.timestamp.equals(reports[0].timestamp),
    )
    assert(timestampsMatch, 'Timestamps must match')

    await knex.transaction(async (trx) => {
      await trx('reports')
        .where('unix_timestamp', rows[0].unix_timestamp)
        .delete()
      await trx('reports')
        .insert(rows)
        .onConflict(['unix_timestamp', 'project_id', 'asset_id'])
        .merge()
    })
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('reports').delete()
  }

  async getDailyByProjectAndAsset(
    projectId: ProjectId,
    assetId: AssetId,
  ): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await this._getByProjectAndAssetQuery(
      knex,
      projectId,
      assetId,
    ).andWhereRaw(`extract(hour from unix_timestamp) = 0`)

    return rows.map(toRecord)
  }

  async getHourlyByProjectAndAsset(
    projectId: ProjectId,
    assetId: AssetId,
    from: UnixTime,
  ): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await this._getByProjectAndAssetQuery(
      knex,
      projectId,
      assetId,
    ).andWhere('unix_timestamp', '>=', from.toDate())
    return rows.map(toRecord)
  }

  async getSixHourlyByProjectAndAsset(
    projectId: ProjectId,
    assetId: AssetId,
    from: UnixTime,
  ): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await this._getByProjectAndAssetQuery(knex, projectId, assetId)
      .andWhereRaw(`extract(hour from "unix_timestamp") % 6 = 0`)
      .andWhere('unix_timestamp', '>=', from.toDate())
    return rows.map(toRecord)
  }

  private _getByProjectAndAssetQuery(
    knex: Knex,
    projectId: ProjectId,
    assetId: AssetId,
  ) {
    return knex('reports')
      .where('asset_id', assetId.toString())
      .andWhere('project_id', projectId.toString())
      .orderBy('unix_timestamp')
  }
}

function toRow(record: ReportRecord): ReportRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    asset_id: record.asset.toString(),
    asset_type: record.type.toString(),
    asset_amount: record.amount.toString(),
    usd_value: record.usdValue.toString(),
    eth_value: record.ethValue.toString(),
  }
}

function toRecord(row: ReportRow): ReportRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    asset: AssetId(row.asset_id),
    type: ValueType(row.asset_type),
    amount: BigInt(row.asset_amount),
    usdValue: BigInt(row.usd_value),
    ethValue: BigInt(row.eth_value),
  }
}
