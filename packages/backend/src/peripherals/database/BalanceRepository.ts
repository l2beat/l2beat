import { AssetId, EthereumAddress, Logger } from '@l2beat/common'
import { Knex } from 'knex'
import { BalanceRow } from 'knex/types/tables'

import { BaseRepository } from './BaseRepository'

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

export class BalanceRepository extends BaseRepository {
  constructor(knex: Knex, logger: Logger) {
    super(knex, logger)
    this.getByBlock = this.wrapGet(this.getByBlock)
    this.getByHolderAndAsset = this.wrapGet(this.getByHolderAndAsset)
    this.addOrUpdateMany = this.wrapAddMany(this.addOrUpdateMany)
    this.getAll = this.wrapGet(this.getAll)
    this.deleteAll = this.wrapDelete(this.deleteAll)
  }

  async getByBlock(blockNumber: bigint): Promise<BalanceRecord[]> {
    const rows = await this.knex('asset_balances')
      .select()
      .where('block_number', Number(blockNumber))
    return rows.map(toRecord)
  }

  async getByHolderAndAsset(
    holder: EthereumAddress,
    asset: AssetId,
  ): Promise<BalanceRecord[]> {
    const rows = await this.knex('asset_balances')
      .select('block_number', 'holder_address', 'asset_id', 'balance')
      .where('holder_address', holder.toString())
      .where('asset_id', asset.toString())

    return rows.map(toRecord)
  }

  async addOrUpdateMany(balances: BalanceRecord[]) {
    const rows = balances.map(toRow)
    const ids = await this.knex('asset_balances')
      .insert(rows)
      .onConflict(['block_number', 'holder_address', 'asset_id'])
      .merge()

    return ids
  }

  async getAll(): Promise<BalanceRecord[]> {
    const rows = await this.knex('asset_balances').select(
      'block_number',
      'holder_address',
      'asset_id',
      'balance',
    )
    return rows.map(toRecord)
  }

  async deleteAll() {
    return await this.knex('asset_balances').delete()
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
