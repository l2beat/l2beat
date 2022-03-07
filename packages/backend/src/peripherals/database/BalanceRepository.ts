import { AssetId, EthereumAddress, Logger } from '@l2beat/common'
import { BigNumber } from 'ethers'
import { Knex } from 'knex'
import { BalanceRow } from 'knex/types/tables'

export interface BalanceRecord {
  blockNumber: number
  holderAddress: EthereumAddress
  assetId: AssetId
  balance: BigNumber
}

export interface DataBoundaries {
  earliestBlockNumber: number | undefined
  latestBlockNumber: number | undefined
}

export class BalanceRepository {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async getDataBoundaries(
    holder: EthereumAddress,
    asset: AssetId
  ): Promise<DataBoundaries> {
    const data = await this.getAllByHolderAndAsset(holder, asset)

    const result = {
      earliestBlockNumber: data[0] ? data[0].blockNumber : undefined,
      latestBlockNumber: data[data.length - 1]
        ? data[data.length - 1].blockNumber
        : undefined,
    }

    return result
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
    blockNumber: row.block_number,
    holderAddress: EthereumAddress(row.holder_address),
    assetId: AssetId(row.asset_id),
    balance: BigNumber.from(row.balance),
  }
}

function toRow(record: BalanceRecord): BalanceRow {
  return {
    block_number: record.blockNumber,
    holder_address: record.holderAddress.toString(),
    asset_id: record.assetId.toString(),
    balance: record.balance.toString(),
  }
}
