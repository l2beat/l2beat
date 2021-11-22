import { Knex } from 'knex'
import { ExchangePriceRow } from 'knex/types/tables'

import { Logger } from '../../tools/Logger'

export interface ExchangePriceRecord {
  blockNumber: bigint
  assetId: string
  exchange: string
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
    asset_id: record.assetId,
    exchange: record.exchange,
    liquidity: record.liquidity.toString(),
    price: record.price.toString(),
  }
}

function toRecord(row: ExchangePriceRow): ExchangePriceRecord {
  return {
    blockNumber: BigInt(row.block_number),
    assetId: row.asset_id,
    exchange: row.exchange,
    liquidity: BigInt(row.liquidity),
    price: BigInt(row.price),
  }
}
