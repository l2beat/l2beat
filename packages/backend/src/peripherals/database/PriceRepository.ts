import { AssetId, Logger, UnixTime } from '@l2beat/common'
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
          earliest: new UnixTime(parseInt(row.min)),
          latest: new UnixTime(parseInt(row.max)),
        },
      ]),
    )
  }

  async getLatestByToken(): Promise<Map<AssetId, PriceRecord>> {
    const knex = await this.knex()

    const rows: PriceRow[] = await knex
      .select('a1.*')
      .from('coingecko_prices as a1')
      .innerJoin(
        knex('coingecko_prices')
          .select(knex.raw('max(unix_timestamp) as unix_timestamp'), 'asset_id')
          .from('coingecko_prices')
          .as('a2')
          .groupBy('asset_id'),
        function () {
          return this.on('a1.unix_timestamp', '=', 'a2.unix_timestamp').andOn(
            'a1.asset_id',
            '=',
            'a2.asset_id',
          )
        },
      )

    return new Map(rows.map((row) => [AssetId(row.asset_id), toRecord(row)]))
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
