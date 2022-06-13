import { CoingeckoId, Logger, UnixTime } from '@l2beat/common'
import { Knex } from 'knex'
import { PriceRow } from 'knex/types/tables'

import { BaseRepository } from './BaseRepository'

export interface PriceRecord {
  coingeckoId: CoingeckoId
  priceUsd: number
  timestamp: UnixTime
}

export interface DataBoundary {
  earliest: UnixTime
  latest: UnixTime
}

export class PriceRepository extends BaseRepository {
  constructor(knex: Knex, logger: Logger) {
    super(knex, logger)

    this.getAll = this.wrapGet(this.getAll)
    this.getByTimestamp = this.wrapGet(this.getByTimestamp)
    this.getByToken = this.wrapGet(this.getByToken)
    this.calcDataBoundaries = this.wrapAny(this.calcDataBoundaries)
    this.addMany = this.wrapAddMany(this.addMany)
  }

  async getAll(): Promise<PriceRecord[]> {
    const rows = await this.knex('coingecko_prices').select(
      'coingecko_id',
      'price_usd',
      'unix_timestamp'
    )
    return rows.map(toRecord)
  }

  async getByTimestamp(timestamp: UnixTime): Promise<PriceRecord[]> {
    const rows = await this.knex('coingecko_prices')
      .where({ unix_timestamp: timestamp.toNumber().toString() })
      .select('coingecko_id', 'price_usd', 'unix_timestamp')

    this.logger.debug({
      method: 'getAllByTimestamp',
      timestamp: timestamp.toString(),
      amount: rows.length,
    })
    return rows.map(toRecord)
  }

  async getByToken(coingeckoId: CoingeckoId) {
    const rows = await this.knex('coingecko_prices')
      .where({ coingecko_id: coingeckoId.toString() })
      .select('coingecko_id', 'price_usd', 'unix_timestamp')

    this.logger.debug({
      method: 'getAllByToken',
      coin: coingeckoId.toString(),
      amount: rows.length,
    })
    return rows.map(toRecord)
  }

  async addMany(prices: PriceRecord[]) {
    const rows: PriceRow[] = prices.map(toRow)

    const ids = await this.knex
      .batchInsert('coingecko_prices', rows, 10_000)
      .returning('unix_timestamp')

    return ids
  }

  async deleteAll() {
    await this.knex('coingecko_prices').delete()
  }

  async calcDataBoundaries(): Promise<Map<CoingeckoId, DataBoundary>> {
    const rows = await this.knex('coingecko_prices')
      .min('unix_timestamp')
      .max('unix_timestamp')
      .select('coingecko_id')
      .groupBy('coingecko_id')

    return new Map(
      rows.map((row) => [
        CoingeckoId(row.coingecko_id),
        {
          earliest: new UnixTime(parseInt(row.min)),
          latest: new UnixTime(parseInt(row.max)),
        },
      ])
    )
  }
}

function toRecord(row: PriceRow): PriceRecord {
  return {
    timestamp: new UnixTime(+row.unix_timestamp),
    coingeckoId: CoingeckoId(row.coingecko_id),
    priceUsd: +row.price_usd,
  }
}

function toRow(record: PriceRecord): PriceRow {
  return {
    coingecko_id: record.coingeckoId.toString(),
    price_usd: record.priceUsd,
    unix_timestamp: record.timestamp.toNumber().toString(),
  }
}
