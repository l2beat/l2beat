import { assert, Logger } from '@l2beat/common'
import { AssetId, ProjectId, UnixTime } from '@l2beat/types'
import { Knex } from 'knex'
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

export const SIX_HOURS = UnixTime.HOUR * 6

export class ReportRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.getAll = this.wrapGet(this.getAll)
    this.getDailyByProjectAndAsset = this.wrapGet(
      this.getDailyByProjectAndAsset,
    )
    this.addOrUpdateMany = this.wrapAddMany(this.addOrUpdateMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)

    /* eslint-enable @typescript-eslint/unbound-method */
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

  private getByProjectAndAssetQuery(
    knex: Knex,
    projectId: ProjectId,
    assetId: AssetId,
  ) {
    return knex('reports')
      .where('asset_id', assetId.toString())
      .andWhere('project_id', projectId.toString())
      .orderBy('unix_timestamp')
  }

  async getDailyByProjectAndAsset(
    projectId: ProjectId,
    assetId: AssetId,
  ): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await this.getByProjectAndAssetQuery(
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
    const rows = await this.getByProjectAndAssetQuery(
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
    const rows = await this.getByProjectAndAssetQuery(knex, projectId, assetId)
      .andWhereRaw(`extract(hour from "unix_timestamp") % 6 = 0`)
      .andWhere('unix_timestamp', '>=', from.toDate())
    return rows.map(toRecord)
  }
}

function toRow(record: ReportRecord): ReportRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    asset_id: record.asset.toString(),
    balance: record.balance.toString(),
    balance_usd: record.balanceUsd.toString(),
    balance_eth: record.balanceEth.toString(),
  }
}

function toRecord(row: ReportRow): ReportRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    asset: AssetId(row.asset_id),
    balance: BigInt(row.balance),
    balanceUsd: BigInt(row.balance_usd),
    balanceEth: BigInt(row.balance_eth),
  }
}
