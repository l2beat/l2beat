import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'

export interface GasPriceRow {
  timestamp: Date
  project: string
  gas_price_gwei: number
}

export interface GasPriceRecord {
  timestamp: UnixTime
  project: string
  gasPriceGwei: number
}

export class GasPriceRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<GasPriceRepository>>(this)
  }

  async addOrUpdateMany(records: GasPriceRecord[], trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    const rows = records.map((r) => toRow(r))
    await knex.batchInsert('gas_prices', rows, 2_000)
    return records.length
  }

  async findByProject(project: string) {
    const knex = await this.knex()
    const rows = await knex('gas_prices')
      .where('project', project)
      .orderBy('timestamp', 'desc')
    return rows.map(toRecord)
  }

  async deleteAfter(
    project: string,
    targetHeight: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    return knex('gas_prices')
      .where('project', project)
      .where('timestamp', '>', targetHeight.toDate())
      .delete()
  }
}

function toRow(record: GasPriceRecord): GasPriceRow {
  return {
    timestamp: record.timestamp.toDate(),
    project: record.project,
    gas_price_gwei: record.gasPriceGwei,
  }
}

function toRecord(row: GasPriceRow): GasPriceRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    project: row.project,
    gasPriceGwei: row.gas_price_gwei,
  }
}
