import { AssetId, EthereumAddress, Logger, UnixTime } from '@l2beat/common'
import { BalanceRow } from 'knex/types/tables'

import { BaseRepository } from './BaseRepository'
import { Database } from './Database'

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
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.getByBlock = this.wrapGet(this.getByBlock)
    this.getByHolderAndAsset = this.wrapGet(this.getByHolderAndAsset)
    this.addOrUpdateMany = this.wrapAddMany(this.addOrUpdateMany)
    this.getAll = this.wrapGet(this.getAll)
    this.deleteAll = this.wrapDelete(this.deleteAll)
  }

  async getByBlock(blockNumber: bigint): Promise<BalanceRecord[]> {
    const knex = await this.knex()
    const rows = await knex
      .from('asset_balances')
      .select()
      .where('block_number', Number(blockNumber))
    return rows.map(toRecord)
  }

  async getByHolderAndAsset(
    holder: EthereumAddress,
    asset: AssetId,
  ): Promise<BalanceRecord[]> {
    const knex = await this.knex()
    const rows = await knex
      .from('asset_balances')
      .select('block_number', 'holder_address', 'asset_id', 'balance')
      .where('holder_address', holder.toString())
      .where('asset_id', asset.toString())

    return rows.map(toRecord)
  }

  async addOrUpdateMany(balances: BalanceRecord[]) {
    const rows = balances.map(toRow)
    const knex = await this.knex()
    await knex('asset_balances')
      .insert(rows)
      .onConflict(['block_number', 'holder_address', 'asset_id'])
      .merge()
    return rows.length
  }

  async getAll(): Promise<BalanceRecord[]> {
    const knex = await this.knex()
    const rows = await knex('asset_balances').select(
      'block_number',
      'holder_address',
      'asset_id',
      'balance',
    )
    return rows.map(toRecord)
  }

  async getLatestPerHolder(): Promise<
    Map<EthereumAddress, (BalanceRecord & { timestamp: UnixTime })[]>
  > {
    const knex = await this.knex()
    const rows = await knex
      .select('a1.*', 'unix_timestamp')
      .from('asset_balances as a1')
      .innerJoin(
        knex('asset_balances')
          .select(
            'holder_address',
            'asset_id',
            knex.raw('max(block_number) as block_number'),
          )
          .from('asset_balances')
          .as('a2')
          .groupBy('holder_address', 'asset_id'),
        function () {
          return this.on('a1.block_number', '=', 'a2.block_number')
            .andOn('a1.holder_address', '=', 'a2.holder_address')
            .andOn('a1.asset_id', '=', 'a2.asset_id')
        },
      )
      .innerJoin(
        'block_numbers',
        'block_numbers.block_number',
        '=',
        'a1.block_number',
      )

    const records = rows.map((row) => ({
      ...toRecord(row),
      timestamp: new UnixTime(+row.unix_timestamp),
    }))

    const result: Map<
      EthereumAddress,
      (BalanceRecord & { timestamp: UnixTime })[]
    > = new Map()

    for (const record of records) {
      const entry = result.get(record.holderAddress) || []
      result.set(record.holderAddress, [...entry, record])
    }

    return result
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('asset_balances').delete()
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
