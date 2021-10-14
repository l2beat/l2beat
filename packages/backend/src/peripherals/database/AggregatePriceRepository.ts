import { Knex } from 'knex'
import { AggregatePriceRow } from 'knex/types/tables'

import { Logger } from '../../tools/Logger'

export interface AggregatePriceRecord {
  blockNumber: bigint
  assetId: string
  priceUsd: bigint
}

export class AggregatePriceRepository {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async add(records: AggregatePriceRecord[]) {
    const rows: AggregatePriceRow[] = records.map(toRow)
    await this.knex('aggregate_prices').insert(rows)
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
    asset_id: record.assetId,
    price_usd: record.priceUsd.toString(),
  }
}

function toRecord(row: AggregatePriceRow): AggregatePriceRecord {
  return {
    blockNumber: BigInt(row.block_number),
    assetId: row.asset_id,
    priceUsd: BigInt(row.price_usd),
  }
}
