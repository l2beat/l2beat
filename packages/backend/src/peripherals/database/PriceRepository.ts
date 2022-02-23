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
    this.logger.debug('Selected rows', { amount: rows.length })
    return rows.map(toRecord)
  }

  async getAllForToken(coingeckoId: CoingeckoId) {
    const rows = await this.knex('coingecko_prices')
      .where({coingecko_id: coingeckoId.toString()})
      .select('coingecko_id', 'price_usd', 'unix_timestamp')

    this.logger.debug('Selected rows', {
      coin: coingeckoId.toString(),
      rowsCount: rows.length,
    })
    return rows.map(toRecord)
  }

  async deleteAll() {
    await this.knex('coingecko_prices').delete()
    this.logger.debug({ method: 'deleteAll' })
  }
}

function toRecord(record: PriceRow): PriceRecord {
  return {
    timestamp: new UnixTime(+record.unix_timestamp),
    coingeckoId: CoingeckoId(record.coingecko_id),
    priceUsd: +record.price_usd,
  }
}
