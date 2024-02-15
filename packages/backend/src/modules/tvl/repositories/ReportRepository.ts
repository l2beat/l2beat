import { Logger } from '@l2beat/backend-tools'
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

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from './deleteArchivedRecords'

export interface ReportRecord {
  timestamp: UnixTime
  projectId: ProjectId
  asset: AssetId
  chainId: ChainId
  reportType: ReportType
  amount: bigint
  usdValue: bigint
  ethValue: bigint
}

export const SIX_HOURS = UnixTime.HOUR * 6
const BATCH_SIZE = 5_000

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
    const chainIdsMatch = reports.every((r) => r.chainId === reports[0].chainId)
    assert(chainIdsMatch, 'Chain Ids must match')

    await this.runInTransaction(async (trx) => {
      for (let i = 0; i < reports.length; i += BATCH_SIZE) {
        await this._addOrUpdateMany(reports.slice(i, i + BATCH_SIZE), trx)
      }
    })

    return reports.length
  }

  async addMany(reports: ReportRecord[]) {
    const rows = reports.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('reports', rows, 10_000)

    return rows.length
  }

  private async _addOrUpdateMany(
    reports: ReportRecord[],
    trx: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    const rows = reports.map(toRow)

    await knex('reports')
      .insert(rows)
      .onConflict([
        'unix_timestamp',
        'project_id',
        'asset_id',
        'chain_id',
        'report_type',
      ])
      .merge()
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('reports').delete()
  }

  async getHourly(
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

  async getSixHourly(
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

  async getDaily(
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

  async deleteHourlyUntil(dateRange: CleanDateRange) {
    const knex = await this.knex()
    return deleteHourlyUntil(knex, 'reports', dateRange)
  }

  async deleteSixHourlyUntil(dateRange: CleanDateRange) {
    const knex = await this.knex()
    return deleteSixHourlyUntil(knex, 'reports', dateRange)
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
