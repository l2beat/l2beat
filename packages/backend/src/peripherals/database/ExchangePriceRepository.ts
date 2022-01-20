import { AssetId, Exchange, Logger } from '@l2beat/common'
import { Knex } from 'knex'
import { ExchangePriceRow } from 'knex/types/tables'

export interface ExchangePriceRecord {
  blockNumber: bigint
  assetId: AssetId
  exchange: Exchange
  liquidity: bigint
  price: bigint
}

export class ExchangePriceRepository {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async add(records: ExchangePriceRecord[]) {
    const rows: ExchangePriceRow[] = records.map(toRow)
    await this.knex('exchange_prices').insert(rows)
    this.logger.debug({ method: 'add', rows: rows.length })
  }

  async getAll() {
    const rows = await this.knex('exchange_prices').select(
      'block_number',
      'asset_id',
      'exchange',
      'liquidity',
      'price'
    )
    this.logger.debug({ method: 'getAll', rows: rows.length })
    return rows.map(toRecord)
  }

  async getAllByAssetIdAndExchange(assetId: AssetId, exchange: Exchange) {
    const rows = await this.knex('exchange_prices')
      .select('block_number', 'liquidity', 'price')
      .where({ asset_id: assetId.toString(), exchange: exchange.name })
      .orderBy('block_number', 'asc')
    this.logger.debug({
      method: 'getAllByAssetIdAndExchange',
      rows: rows.length,
    })
    return rows.map(toPriceRecord)
  }

  async getAllByBlockNumber(blockNumber: bigint) {
    const rows = await this.knex('exchange_prices')
      .select('block_number', 'asset_id', 'exchange', 'liquidity', 'price')
      .where({ block_number: Number(blockNumber) })
    this.logger.debug({ method: 'getAllByBlockNumber', rows: rows.length })
    return rows.map(toRecord)
  }

  async deleteAll() {
    await this.knex('exchange_prices').delete()
    this.logger.debug({ method: 'deleteAll' })
  }
}

function toRow(record: ExchangePriceRecord): ExchangePriceRow {
  return {
    block_number: Number(record.blockNumber),
    asset_id: record.assetId.toString(),
    exchange: record.exchange.name,
    liquidity: record.liquidity.toString(),
    price: record.price.toString(),
  }
}

function toRecord(row: ExchangePriceRow): ExchangePriceRecord {
  return {
    blockNumber: BigInt(row.block_number),
    assetId: AssetId(row.asset_id),
    exchange: Exchange.fromName(row.exchange),
    liquidity: BigInt(row.liquidity),
    price: BigInt(row.price),
  }
}

function toPriceRecord(
  row: Omit<ExchangePriceRow, 'asset_id' | 'exchange'>
): Omit<ExchangePriceRecord, 'assetId' | 'exchange'> {
  return {
    blockNumber: BigInt(row.block_number),
    liquidity: BigInt(row.liquidity),
    price: BigInt(row.price),
  }
}
