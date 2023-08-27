import { Logger } from '@l2beat/shared'
import {
  assert,
  AssetId,
  ChainId,
  ProjectId,
  ReportType,
  UnixTime,
} from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { ReportRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface ReportRecord {
  timestamp: UnixTime
  projectId: ProjectId
  asset: AssetId
  chainId: ChainId
  // TODO: Index this column when we start querying by it.
  // TODO: Rename
  reportType: ReportType
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

  // TODO: phase out this method
  async getByTimestamp(timestamp: UnixTime): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('reports').where(
      'unix_timestamp',
      timestamp.toDate(),
    )
    return rows.map(toRecord)
  }

  async getByTimestampAndPreciseAsset(
    timestamp: UnixTime,
    chainId: ChainId,
    assetType: ReportType,
  ): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('reports')
      .where('unix_timestamp', timestamp.toDate())
      .andWhere('report_type', assetType.toString())
      .andWhere('chain_id', chainId.valueOf())
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
    const reportTypeMatch = reports.every(
      (r) => r.reportType === reports[0].reportType,
    )
    const chainIdsMatch = reports.every((r) => r.chainId === reports[0].chainId)
    assert(timestampsMatch, 'Timestamps must match')
    assert(reportTypeMatch, 'Report types must match')
    assert(chainIdsMatch, 'Chain Ids must match')

    await knex.transaction(async (trx) => {
      await trx('reports')
        .where('unix_timestamp', rows[0].unix_timestamp)
        .andWhere('report_type', rows[0].report_type)
        .andWhere('chain_id', rows[0].chain_id)
        .delete()
      await trx('reports')
        .insert(rows)
        .onConflict([
          'unix_timestamp',
          'project_id',
          'asset_id',
          'chain_id',
          'report_type',
        ])
        .merge()
    })
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('reports').delete()
  }

  /**
   * To be removed along old TVL api
   * @deprecated
   */
  async getDailyByProjectAndAsset(
    projectId: ProjectId,
    assetId: AssetId,
  ): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await this._getByProjectAndAssetQuery(knex, projectId, assetId)
      .andWhereRaw(`extract(hour from unix_timestamp) = 0`)
      .whereIn('chain_id', [ChainId.ETHEREUM, ChainId.ARBITRUM, ChainId.NMV])
      .whereIn('report_type', ['EBV', 'CBV', 'NMV'])

    return rows.map(toRecord)
  }

  /**
   * To be removed along old TVL api
   * @deprecated
   */
  async getHourlyByProjectAndAsset(
    projectId: ProjectId,
    assetId: AssetId,
    from: UnixTime,
  ): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await this._getByProjectAndAssetQuery(knex, projectId, assetId)
      .andWhere('unix_timestamp', '>=', from.toDate())
      .whereIn('chain_id', [ChainId.ETHEREUM, ChainId.ARBITRUM, ChainId.NMV])
      .whereIn('report_type', ['EBV', 'CBV', 'NMV'])

    return rows.map(toRecord)
  }

  /**
   * To be removed along old TVL api
   * @deprecated
   */
  async getSixHourlyByProjectAndAsset(
    projectId: ProjectId,
    assetId: AssetId,
    from: UnixTime,
  ): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await this._getByProjectAndAssetQuery(knex, projectId, assetId)
      .andWhereRaw(`extract(hour from "unix_timestamp") % 6 = 0`)
      .andWhere('unix_timestamp', '>=', from.toDate())
      .whereIn('chain_id', [ChainId.ETHEREUM, ChainId.ARBITRUM, ChainId.NMV])
      .whereIn('report_type', ['EBV', 'CBV', 'NMV'])

    return rows.map(toRecord)
  }

  // Detailed asset TVL
  async getHourlyForDetailed(
    projectId: ProjectId,
    chainId: ChainId,
    assetId: AssetId,
    assetType: ReportType,
    from: UnixTime,
  ): Promise<ReportRecord[]> {
    const knex = await this.knex()

    const rows = await knex('reports')
      .where('asset_id', assetId.toString())
      .andWhere('chain_id', chainId.valueOf())
      .andWhere('project_id', projectId.valueOf())
      .andWhere('report_type', assetType.toString())
      .andWhere('unix_timestamp', '>=', from.toDate())
      .orderBy('unix_timestamp')

    return rows.map(toRecord)
  }

  async getSixHourlyForDetailed(
    projectId: ProjectId,
    chainId: ChainId,
    assetId: AssetId,
    assetType: ReportType,
    from: UnixTime,
  ): Promise<ReportRecord[]> {
    const knex = await this.knex()

    const rows = await knex('reports')
      .where('asset_id', assetId.toString())
      .andWhere('project_id', projectId.valueOf())
      .andWhere('chain_id', chainId.valueOf())
      .andWhere('report_type', assetType.toString())
      .andWhereRaw(`extract(hour from "unix_timestamp") % 6 = 0`)
      .andWhere('unix_timestamp', '>=', from.toDate())
      .orderBy('unix_timestamp')

    return rows.map(toRecord)
  }

  async getDailyForDetailed(
    projectId: ProjectId,
    chainId: ChainId,
    assetId: AssetId,
    assetType: ReportType,
  ): Promise<ReportRecord[]> {
    const knex = await this.knex()

    const rows = await knex('reports')
      .where('asset_id', assetId.toString())
      .andWhere('chain_id', chainId.valueOf())
      .andWhere('project_id', projectId.valueOf())
      .andWhere('report_type', assetType.toString())
      .andWhereRaw(`extract(hour from "unix_timestamp") = 0`)
      .orderBy('unix_timestamp')

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
    report_type: record.reportType.toString(),
    chain_id: record.chainId.valueOf(),
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
    reportType: ReportType(row.report_type),
    chainId: ChainId(row.chain_id),
    amount: BigInt(row.asset_amount),
    usdValue: BigInt(row.usd_value),
    ethValue: BigInt(row.eth_value),
  }
}
