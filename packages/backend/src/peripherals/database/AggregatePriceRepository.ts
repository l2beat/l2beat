import { AssetId, Logger } from '@l2beat/common'
import { Knex } from 'knex'
import { AggregatePriceRow } from 'knex/types/tables'

export interface AggregatePriceRecord {
  blockNumber: bigint
  assetId: AssetId
  priceUsd: bigint
}

export class AggregatePriceRepository {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async addOrUpdate(records: AggregatePriceRecord[]) {
    const rows: AggregatePriceRow[] = records.map(toRow)
    await this.knex('aggregate_prices')
      .insert(rows)
      .onConflict(['block_number', 'asset_id'])
      .merge()
    this.logger.debug({ method: 'add', rows: rows.length })
  }

  async getAll() {
    const rows = await this.knex('aggregate_prices').select(
      'block_number',
      'asset_id',
      'price_usd'
    )
    this.logger.debug({ method: 'getAll', rows: rows.length })
    return rows.map(toRecord)
  }

  async getAllByAssetId(assetId: AssetId) {
    const rows = await this.knex('aggregate_prices')
      .select('block_number', 'price_usd')
      .where({ asset_id: assetId.toString() })
      .orderBy('block_number', 'asc')
    this.logger.debug({ method: 'getAllByAssetId', rows: rows.length })
    return rows.map(toPriceRecord)
  }

  async getAllByBlockNumber(blockNumber: bigint) {
    const rows = await this.knex('aggregate_prices')
      .select('block_number', 'asset_id', 'price_usd')
      .where({ block_number: Number(blockNumber) })
    this.logger.debug({ method: 'getAllByBlockNumber', rows: rows.length })
    return rows.map(toRecord)
  }

  async deleteAll() {
    await this.knex('aggregate_prices').delete()
    this.logger.debug({ method: 'deleteAll' })
  }
}

function toRow(record: AggregatePriceRecord): AggregatePriceRow {
  return {
    block_number: Number(record.blockNumber),
    asset_id: record.assetId.toString(),
    price_usd: record.priceUsd.toString(),
  }
}

function toRecord(row: AggregatePriceRow): AggregatePriceRecord {
  return {
    blockNumber: BigInt(row.block_number),
    assetId: AssetId(row.asset_id),
    priceUsd: BigInt(row.price_usd),
  }
}

function toPriceRecord(
  row: Omit<AggregatePriceRow, 'asset_id'>
): Omit<AggregatePriceRecord, 'assetId'> {
  return {
    blockNumber: BigInt(row.block_number),
    priceUsd: BigInt(row.price_usd),
  }
}
