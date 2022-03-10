import { AssetId, EthereumAddress, Logger } from '@l2beat/common'
import { Knex } from 'knex'
import { BalanceRow } from 'knex/types/tables'

export interface BalanceRecord {
  blockNumber: bigint
  holderAddress: EthereumAddress
  assetId: AssetId
  balance: bigint
}

export interface DataBoundary {
  earliestBlockNumber: bigint | undefined
  latestBlockNumber: bigint | undefined
}

export class BalanceRepository {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async getDataBoundaries(): Promise<Map<string, DataBoundary>> {
    const rows = await this.knex('asset_balances')
      .select('holder_address', 'asset_id')
      .max('block_number')
      .min('block_number')
      .groupBy('holder_address', 'asset_id')

    const data = rows.map((row) => [
      `${row.holder_address}-${row.asset_id}`,
      { earliestBlockNumber: BigInt(row.min), latestBlockNumber: BigInt(row.max) },
    ])
    return new Map(data)
  }

  async getAllByHolderAndAsset(
    holder: EthereumAddress,
    asset: AssetId
  ): Promise<BalanceRecord[]> {
    const rows = await this.knex('asset_balances')
      .select('block_number', 'holder_address', 'asset_id', 'balance')
      .where('holder_address', holder.toString())
      .where('asset_id', asset.toString())

    return rows.map(toRecord)
  }

  async addOrUpdate(balances: BalanceRecord[]) {
    const rows = balances.map(toRow)
    await this.knex('asset_balances')
      .insert(rows)
      .onConflict(['block_number', 'holder_address', 'asset_id'])
      .merge()

    this.logger.debug({ method: 'addOrUpdate', amount: rows.length })
  }

  async getAll(): Promise<BalanceRecord[]> {
    const rows = await this.knex('asset_balances').select(
      'block_number',
      'holder_address',
      'asset_id',
      'balance'
    )
    this.logger.debug({ method: 'getAll', amount: rows.length })
    return rows.map(toRecord)
  }

  async deleteAll() {
    await this.knex('asset_balances').delete()
    this.logger.debug({ method: 'deleteAll' })
  }
}

function toRecord(row: BalanceRow): BalanceRecord {
  return {
    blockNumber: BigInt(row.block_number),
    holderAddress: EthereumAddress(row.holder_address),
    assetId: AssetId(row.asset_id),
    balance: BigInt(row.balance),
  }
}

function toRow(record: BalanceRecord): BalanceRow {
  return {
    block_number: Number(record.blockNumber),
    holder_address: record.holderAddress.toString(),
    asset_id: record.assetId.toString(),
    balance: record.balance.toString(),
  }
}
