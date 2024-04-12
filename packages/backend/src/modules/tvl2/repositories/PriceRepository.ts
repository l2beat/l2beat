import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'

export interface PriceRow {
  configuration_id: string
  timestamp: Date
  price_usd: number
}

export interface PriceRecord {
  configId: string
  timestamp: UnixTime
  priceUsd: number
}

export class PriceRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<PriceRepository>>(this)
  }

  async addMany(records: PriceRecord[]) {
    const rows: PriceRow[] = records.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('prices', rows, 10_000)
    return rows.length
  }

  async deleteAfterExclusive(configId: string, timestamp: UnixTime) {
    const knex = await this.knex()
    return knex('prices')
      .where('configuration_id', configId)
      .where('timestamp', '>', timestamp.toDate())
      .delete()
  }

  // #region methods used only in tests

  async getAll(): Promise<PriceRecord[]> {
    const knex = await this.knex()
    const rows = await knex('prices')
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('prices').delete()
  }

  // #endregion
}

function toRecord(row: PriceRow): PriceRecord {
  return {
    configId: row.configuration_id,
    timestamp: UnixTime.fromDate(row.timestamp),
    priceUsd: +row.price_usd,
  }
}

function toRow(record: PriceRecord): PriceRow {
  return {
    configuration_id: record.configId,
    timestamp: record.timestamp.toDate(),
    price_usd: record.priceUsd,
  }
}
