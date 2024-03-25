import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'

export interface PriceRow {
  chain: string
  address: string
  timestamp: Date
  price_usd: number
}

export interface PriceRecord {
  chain: string
  address: EthereumAddress | 'native'
  timestamp: UnixTime
  priceUsd: number
}

export class PriceRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<PriceRepository>>(this)
  }

  async getAll(): Promise<PriceRecord[]> {
    const knex = await this.knex()
    const rows = await knex('prices')
    return rows.map(toRecord)
  }

  async addMany(records: PriceRecord[]) {
    const rows: PriceRow[] = records.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('prices', rows, 10_000)
    return rows.length
  }

  async deleteAfterExclusive(
    chain: string,
    address: EthereumAddress | 'native',
    timestamp: UnixTime,
  ) {
    const knex = await this.knex()
    return knex('prices')
      .where('chain', chain)
      .where('address', address === 'native' ? 'native' : address.toString())
      .where('timestamp', '>', timestamp.toDate())
      .delete()
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('prices').delete()
  }
}

function toRecord(row: PriceRow): PriceRecord {
  return {
    chain: row.chain,
    address: row.address === 'native' ? 'native' : EthereumAddress(row.address),
    timestamp: UnixTime.fromDate(row.timestamp),
    priceUsd: +row.price_usd,
  }
}

function toRow(record: PriceRecord): PriceRow {
  return {
    chain: record.chain,
    address: record.address === 'native' ? 'native' : record.address.toString(),
    timestamp: record.timestamp.toDate(),
    price_usd: record.priceUsd,
  }
}
