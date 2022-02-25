import { CoingeckoId, Logger, UnixTime } from '@l2beat/common'
import { Knex } from 'knex'
import { PriceRow } from 'knex/types/tables'

export interface PriceRecord {
  coingeckoId: CoingeckoId
  priceUsd: number
  timestamp: UnixTime
}

export class PriceRepository {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async getAll(): Promise<PriceRecord[]> {
    const rows = await this.knex('coingecko_prices').select(
      'coingecko_id',
      'price_usd',
      'unix_timestamp'
    )
    this.logger.debug({ method: 'getAll', amount: rows.length })
    return rows.map(toRecord)
  }

  async getAllByToken(coingeckoId: CoingeckoId) {
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

  async addOrUpdate(prices: PriceRecord[]) {
    const rows: PriceRow[] = prices.map(toRow)
    await this.knex('coingecko_prices')
      .insert(rows)
      .onConflict(['coingecko_id', 'unix_timestamp'])
      .merge()
    this.logger.debug({ method: 'add', amount: rows.length })
  }

  async deleteAll() {
    await this.knex('coingecko_prices').delete()
    this.logger.debug({ method: 'deleteAll' })
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
