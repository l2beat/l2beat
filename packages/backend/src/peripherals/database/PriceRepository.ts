import { AssetId, Logger, UnixTime } from '@l2beat/common'
import { Knex } from 'knex'
import { PriceRow } from 'knex/types/tables'

import { BaseRepository } from './BaseRepository'

export interface PriceRecord {
  assetId: AssetId
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
    const rows = await this.knex('coingecko_prices')
    return rows.map(toRecord)
  }

  async getByTimestamp(timestamp: UnixTime): Promise<PriceRecord[]> {
    const rows = await this.knex('coingecko_prices').where({
      unix_timestamp: timestamp.toString(),
    })

    this.logger.debug({
      method: 'getByTimestamp',
      timestamp: timestamp.toString(),
      amount: rows.length,
    })
    return rows.map(toRecord)
  }

  async getByToken(assetId: AssetId) {
    const rows = await this.knex('coingecko_prices').where({
      asset_id: assetId.toString(),
    })

    this.logger.debug({
      method: 'getByToken',
      coin: assetId.toString(),
      amount: rows.length,
    })
    return rows.map(toRecord)
  }

  async addMany(prices: PriceRecord[]) {
    const rows: PriceRow[] = prices.map(toRow)
    await this.knex.batchInsert('coingecko_prices', rows, 10_000)
    return rows.length
  }

  async deleteAll() {
    await this.knex('coingecko_prices').delete()
  }

  async calcDataBoundaries(): Promise<Map<AssetId, DataBoundary>> {
    const rows = await this.knex('coingecko_prices')
      .min('unix_timestamp')
      .max('unix_timestamp')
      .select('asset_id')
      .groupBy('asset_id')

    return new Map(
      rows.map((row) => [
        AssetId(row.asset_id),
        {
          earliest: new UnixTime(parseInt(row.min)),
          latest: new UnixTime(parseInt(row.max)),
        },
      ]),
    )
  }
}

function toRecord(row: PriceRow): PriceRecord {
  return {
    timestamp: new UnixTime(+row.unix_timestamp),
    assetId: AssetId(row.asset_id),
    priceUsd: +row.price_usd,
  }
}

function toRow(record: PriceRecord): PriceRow {
  return {
    asset_id: record.assetId.toString(),
    price_usd: record.priceUsd,
    unix_timestamp: record.timestamp.toNumber().toString(),
  }
}
