import { AssetId, EthereumAddress, Logger, UnixTime } from '@l2beat/common'
import { ReportRow } from 'knex/types/tables'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

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
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.getDaily = this.wrapGet(this.getDaily)
    this.getAll = this.wrapGet(this.getAll)
    this.addOrUpdateMany = this.wrapAddMany(this.addOrUpdateMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async getDaily(): Promise<ReportRecord[]> {
    const knex = await this.knex()
    const rows = await knex('reports')
      .select()
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
      .onConflict(['block_number', 'bridge_address', 'asset_id'])
      .merge()
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('reports').delete()
  }

  async getLatestPerBridge(): Promise<Map<EthereumAddress, ReportRecord[]>> {
    const knex = await this.knex()
    const rows: ReportRow[] = await knex
      .select('a1.*')
      .from('reports as a1')
      .innerJoin(
        knex('reports')
          .select(
            knex.raw('max(unix_timestamp) as unix_timestamp'),
            'bridge_address',
            'asset_id',
          )
          .from('reports')
          .as('a2')
          .groupBy('bridge_address', 'asset_id'),
        function () {
          return this.on('a1.unix_timestamp', '=', 'a2.unix_timestamp')
            .andOn('a1.bridge_address', '=', 'a2.bridge_address')
            .andOn('a1.asset_id', '=', 'a2.asset_id')
        },
      )

    const records = rows.map(toRecord)

    const result = new Map<EthereumAddress, ReportRecord[]>()

    for (const record of records) {
      const entry = result.get(record.bridge) ?? []
      result.set(record.bridge, [...entry, record])
    }

    return result
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
