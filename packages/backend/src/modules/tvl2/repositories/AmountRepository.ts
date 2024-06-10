import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Knex } from 'knex'
import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../utils/deleteArchivedRecords'
export interface AmountRow {
  configuration_id: string
  timestamp: Date
  amount: string
}

export interface AmountRecord {
  configId: string
  timestamp: UnixTime
  amount: bigint
}

export class AmountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<AmountRepository>>(this)
  }

  async getByConfigIdsAndTimestamp(
    configIds: string[],
    timestamp: UnixTime,
  ): Promise<AmountRecord[]> {
    const knex = await this.knex()
    const rows = await knex('amounts')
      .whereIn('configuration_id', configIds)
      .where('timestamp', timestamp.toDate())
      .orderBy('configuration_id')
    return rows.map(toRecord)
  }

  async getByConfigIdsInRange(
    configIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<AmountRecord[]> {
    const knex = await this.knex()
    const rows = await knex('amounts')
      .whereIn('configuration_id', configIds)
      .andWhere('timestamp', '>=', fromInclusive.toDate())
      .andWhere('timestamp', '<=', toInclusive.toDate())
      .orderBy('timestamp')

    return rows.map(toRecord)
  }

  async getDailyByConfigId(configIds: string[]) {
    const knex = await this.knex()
    const rows = await knex('amounts')
      .whereIn('configuration_id', configIds)
      .andWhereRaw(`extract(hour from "timestamp") % 24 = 0`)
      .orderBy('timestamp')

    return rows.map(toRecord)
  }

  async addMany(records: AmountRecord[], trx?: Knex.Transaction) {
    const rows: AmountRow[] = records.map(toRow)
    const knex = await this.knex(trx)
    await knex.batchInsert('amounts', rows, 1_000)
    return rows.length
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ) {
    const knex = await this.knex()
    return knex('amounts')
      .where('configuration_id', configId)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .delete()
  }

  async deleteByConfigAfter(configId: string, fromExclusive: UnixTime) {
    const knex = await this.knex()
    return knex('amounts')
      .where('configuration_id', configId)
      .where('timestamp', '>', fromExclusive.toDate())
      .delete()
  }

  // #region methods used only in TvlCleaner

  async deleteHourlyUntil(dateRange: CleanDateRange) {
    const knex = await this.knex()
    return deleteHourlyUntil(knex, 'amounts', dateRange)
  }

  async deleteSixHourlyUntil(dateRange: CleanDateRange) {
    const knex = await this.knex()
    return deleteSixHourlyUntil(knex, 'amounts', dateRange)
  }

  // #endregion

  // #region methods used only in tests

  async getAll(): Promise<AmountRecord[]> {
    const knex = await this.knex()
    const rows = await knex('amounts')
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('amounts').delete()
  }

  // #endregion
}

function toRecord(row: AmountRow): AmountRecord {
  return {
    configId: row.configuration_id,
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),
  }
}

function toRow(record: AmountRecord): AmountRow {
  return {
    configuration_id: record.configId,
    timestamp: record.timestamp.toDate(),
    amount: record.amount.toString(),
  }
}
