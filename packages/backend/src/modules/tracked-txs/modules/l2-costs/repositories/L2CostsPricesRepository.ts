import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { L2CostsPricesRow } from 'knex/types/tables'

import {
  BaseRepository,
  CheckConvention,
} from '../../../../../peripherals/database/BaseRepository'
import { Database } from '../../../../../peripherals/database/Database'

export interface L2CostsPricesRecord {
  timestamp: UnixTime
  priceUsd: number
}

export class L2CostsPricesRepository extends BaseRepository {
  private readonly TABLE_NAME = 'l2_costs_prices'

  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<L2CostsPricesRepository>>(this)
  }

  async getAll(): Promise<L2CostsPricesRecord[]> {
    const knex = await this.knex()
    const rows = await knex(this.TABLE_NAME)
    return rows.map(toRecord)
  }

  async getByTimestampRange(
    from: UnixTime,
    to: UnixTime,
  ): Promise<L2CostsPricesRecord[]> {
    const knex = await this.knex()
    const rows = await knex(this.TABLE_NAME)
      .where('timestamp', '>=', from.toDate())
      .andWhere('timestamp', '<=', to.toDate())

    return rows.map(toRecord)
  }

  async addMany(records: L2CostsPricesRecord[]): Promise<number> {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex.batchInsert(this.TABLE_NAME, rows, 10_000)
    return rows.length
  }

  async deleteAfter(from: UnixTime): Promise<number> {
    const knex = await this.knex()
    return await knex(this.TABLE_NAME)
      .where('timestamp', '>', from.toDate())
      .delete()
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex(this.TABLE_NAME).delete()
  }
}

function toRow(record: L2CostsPricesRecord): L2CostsPricesRow {
  return {
    timestamp: record.timestamp.toDate(),
    price_usd: record.priceUsd,
  }
}

function toRecord(row: L2CostsPricesRow): L2CostsPricesRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    priceUsd: row.price_usd,
  }
}
