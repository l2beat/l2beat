import { AssetId, EthereumAddress, Logger, UnixTime } from '@l2beat/common'
import { Knex } from 'knex'
import { ReportRow } from 'knex/types/tables'

import { BaseRepository } from './BaseRepository'

export interface ReportRecord {
  blockNumber: bigint
  timestamp: UnixTime
  bridge: EthereumAddress
  asset: AssetId
  balanceUsd: bigint
  balanceEth: bigint
  balance: bigint
}

export class ReportRepository extends BaseRepository {
  constructor(knex: Knex, logger: Logger) {
    super(knex, logger)

    this.getDaily = this.wrapGet(this.getDaily)
    this.getAll = this.wrapGet(this.getAll)
    this.addOrUpdateMany = this.wrapAddMany(this.addOrUpdateMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
  }

  async getDaily(): Promise<ReportRecord[]> {
    const rows = await this.knex('reports')
      .select()
      .where('is_daily', '=', true)
      .orderBy('unix_timestamp')

    return rows.map((r) => toRecord(r))
  }

  async getAll(): Promise<ReportRecord[]> {
    const rows = await this.knex('reports').select()
    return rows.map(toRecord)
  }

  async addOrUpdateMany(reports: ReportRecord[]) {
    const rows = reports.map(toRow)
    await this.knex('reports')
      .insert(rows)
      .onConflict(['block_number', 'bridge_address', 'asset_id'])
      .merge()
    return rows.length
  }

  async deleteAll() {
    return await this.knex('reports').delete()
  }
}

function toRow(record: ReportRecord): ReportRow {
  return {
    block_number: Number(record.blockNumber),
    unix_timestamp: record.timestamp.toNumber().toString(),
    bridge_address: record.bridge.toString(),
    asset_id: record.asset.toString(),
    balance: record.balance.toString(),
    usd_tvl: record.balanceUsd.toString(),
    eth_tvl: record.balanceEth.toString(),
    is_daily: record.timestamp.toNumber() % 86400 === 0 ? true : false,
  }
}

function toRecord(row: ReportRow): ReportRecord {
  return {
    blockNumber: BigInt(row.block_number),
    timestamp: new UnixTime(+row.unix_timestamp),
    bridge: EthereumAddress.unsafe(row.bridge_address),
    asset: AssetId(row.asset_id),
    balance: BigInt(row.balance),
    balanceUsd: BigInt(row.usd_tvl),
    balanceEth: BigInt(row.eth_tvl),
  }
}
