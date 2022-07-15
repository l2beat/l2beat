import { AssetId, Logger, ProjectId, UnixTime } from '@l2beat/common'
import { ReportRow } from 'knex/types/tables'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface ReportRecord {
  timestamp: UnixTime
  projectId: ProjectId
  asset: AssetId
  balanceUsd: bigint
  balanceEth: bigint
  balance: bigint
}

export class ReportRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.getDaily = this.wrapGet(this.getDaily)
    this.getAll = this.wrapGet(this.getAll)
    this.getDailyByProjectAndAsset = this.wrapGet(
      this.getDailyByProjectAndAsset,
    )
    this.addOrUpdateMany = this.wrapAddMany(this.addOrUpdateMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async getDaily(): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('reports')
      .where('is_daily', '=', true)
      .orderBy('unix_timestamp')

    return rows.map((r) => toRecord(r))
  }

  async getAll(): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('reports').select()
    return rows.map(toRecord)
  }

  async addOrUpdateMany(reports: ReportRecord[]) {
    const rows = reports.map(toRow)
    const knex = await this.knex()
    await knex('reports')
      .insert(rows)
      .onConflict(['unix_timestamp', 'project_id', 'asset_id'])
      .merge()
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
    const rows = await knex('reports')
      .where('asset_id', assetId.toString())
      .andWhere('project_id', projectId.toString())
      .andWhere('is_daily', true)
      .orderBy('unix_timestamp', 'asc')
    return rows.map(toRecord)
  }
}

function toRow(record: ReportRecord): ReportRow {
  return {
    unix_timestamp: record.timestamp.toNumber().toString(),
    project_id: record.projectId.toString(),
    asset_id: record.asset.toString(),
    balance: record.balance.toString(),
    balance_usd: record.balanceUsd.toString(),
    balance_eth: record.balanceEth.toString(),
    is_daily: record.timestamp.toNumber() % 86400 === 0 ? true : false,
  }
}

function toRecord(row: ReportRow): ReportRecord {
  return {
    timestamp: new UnixTime(+row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    asset: AssetId(row.asset_id),
    balance: BigInt(row.balance),
    balanceUsd: BigInt(row.balance_usd),
    balanceEth: BigInt(row.balance_eth),
  }
}
