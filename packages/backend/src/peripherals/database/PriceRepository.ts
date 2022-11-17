import { Logger } from '@l2beat/common'
import { AssetId, UnixTime } from '@l2beat/types'
import { PriceRow } from 'knex/types/tables'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

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
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.getAll = this.wrapGet(this.getAll)
    this.getByTimestamp = this.wrapGet(this.getByTimestamp)
    this.getByToken = this.wrapGet(this.getByToken)
    this.calcDataBoundaries = this.wrapAny(this.calcDataBoundaries)
    this.addMany = this.wrapAddMany(this.addMany)
    this.getLatestByTokenBetween = this.wrapAny(this.getLatestByTokenBetween)
    this.findByTimestampAndToken = this.wrapFind(this.findByTimestampAndToken)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async getAll(): Promise<PriceRecord[]> {
    const knex = await this.knex()
    const rows = await knex('coingecko_prices')
    return rows.map(toRecord)
  }

  async getByTimestamp(timestamp: UnixTime): Promise<PriceRecord[]> {
    const knex = await this.knex()
    const rows = await knex('coingecko_prices').where({
      unix_timestamp: timestamp.toDate(),
    })

    this.logger.debug({
      method: 'getByTimestamp',
      timestamp: timestamp.toString(),
      amount: rows.length,
    })
    return rows.map(toRecord)
  }

  async getByToken(assetId: AssetId) {
    const knex = await this.knex()
    const rows = await knex('coingecko_prices').where({
      asset_id: assetId.toString(),
    })

    this.logger.debug({
      method: 'getByToken',
      coin: assetId.toString(),
      amount: rows.length,
    })
    return rows.map(toRecord)
  }

  async findByTimestampAndToken(timestamp: UnixTime, assetId: AssetId) {
    const knex = await this.knex()
    const row = await knex('coingecko_prices')
      .where({
        asset_id: assetId.toString(),
        unix_timestamp: timestamp.toDate(),
      })
      .first()
    return row ? toRecord(row) : undefined
  }

  async addMany(prices: PriceRecord[]) {
    const rows: PriceRow[] = prices.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('coingecko_prices', rows, 10_000)
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    await knex('coingecko_prices').delete()
  }

  async calcDataBoundaries(): Promise<Map<AssetId, DataBoundary>> {
    const knex = await this.knex()
    const rows = await knex('coingecko_prices')
      .min('unix_timestamp')
      .max('unix_timestamp')
      .select('asset_id')
      .groupBy('asset_id')

    return new Map(
      rows.map((row) => [
        AssetId(row.asset_id),
        {
          earliest: UnixTime.fromDate(row.min),
          latest: UnixTime.fromDate(row.max),
        },
      ]),
    )
  }

  async getLatestByTokenBetween(
    from: UnixTime,
    to: UnixTime,
  ): Promise<Map<AssetId, UnixTime | undefined>> {
    const knex = await this.knex()

    const rows = await knex('coingecko_prices')
      .max('unix_timestamp')
      .select('asset_id')
      .groupBy('asset_id')
      .where('unix_timestamp', '>=', from.toDate())
      .andWhere('unix_timestamp', '<=', to.toDate())

    return new Map(
      rows.map((row) => [AssetId(row.asset_id), UnixTime.fromDate(row.max)]),
    )
  }
}

function toRecord(row: PriceRow): PriceRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    assetId: AssetId(row.asset_id),
    priceUsd: +row.price_usd,
  }
}

function toRow(record: PriceRecord): PriceRow {
  return {
    asset_id: record.assetId.toString(),
    price_usd: record.priceUsd,
    unix_timestamp: record.timestamp.toDate(),
  }
}
