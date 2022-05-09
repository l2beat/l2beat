import { AssetId, EthereumAddress, Logger, UnixTime } from '@l2beat/common'
import { Knex } from 'knex'
import { ReportRow } from 'knex/types/tables'

export interface ReportRecord {
  blockNumber: bigint
  timestamp: UnixTime
  bridge: EthereumAddress
  asset: AssetId
  usdTVL: bigint
  ethTVL: bigint
}

export interface ReportWithBalance extends ReportRecord {
  balance: bigint
}

export class ReportRepository {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async getDaily(): Promise<ReportWithBalance[]> {
    const rows = await this.knex('reports')
      .select()
      .whereRaw('mod(reports.unix_timestamp,86400) = 0')
      .orderBy('unix_timestamp')
      .innerJoin('asset_balances', function () {
        this.on('asset_balances.block_number', '=', 'reports.block_number')
          .andOn('asset_balances.asset_id', '=', 'reports.asset_id')
          .andOn('asset_balances.holder_address', '=', 'reports.bridge_address')
      })

    return rows.map((r) => toRecordWithBalance(r, r.balance))
  }

  async getAll(): Promise<ReportRecord[]> {
    const rows = await this.knex('reports').select()
    return rows.map(toRecord)
  }

  async addOrUpdate(reports: ReportRecord[]) {
    const rows = reports.map(toRow)
    await this.knex('reports')
      .insert(rows)
      .onConflict(['block_number', 'bridge_address', 'asset_id'])
      .merge()

    this.logger.debug({ method: 'addOrUpdate', amount: rows.length })
  }

  async deleteAll() {
    await this.knex('reports').delete()
    this.logger.debug({ method: 'deleteAll' })
  }
}

function toRow(record: ReportRecord): ReportRow {
  return {
    block_number: Number(record.blockNumber),
    unix_timestamp: record.timestamp.toNumber().toString(),
    bridge_address: record.bridge.toString(),
    asset_id: record.asset.toString(),
    usd_tvl: record.usdTVL.toString(),
    eth_tvl: record.ethTVL.toString(),
  }
}

function toRecord(row: ReportRow): ReportRecord {
  return {
    blockNumber: BigInt(row.block_number),
    timestamp: new UnixTime(+row.unix_timestamp),
    bridge: EthereumAddress(row.bridge_address),
    asset: AssetId(row.asset_id),
    usdTVL: BigInt(row.usd_tvl),
    ethTVL: BigInt(row.eth_tvl),
  }
}
function toRecordWithBalance(
  row: ReportRow,
  balance: string
): ReportWithBalance {
  return {
    ...toRecord(row),
    balance: BigInt(balance),
  }
}
