import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'
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

  async getHourly(from: UnixTime, to: UnixTime, configIds: string[]) {
    const knex = await this.knex()
    const rows = await knex('amounts')
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<', to.toDate())
      .whereIn('configuration_id', configIds)
      .orderBy('timestamp')
    return rows.map(toRecord)
  }

  async getSixHourly(from: UnixTime, to: UnixTime, configIds: string[]) {
    const knex = await this.knex()
    const rows = await knex('amounts')
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<', to.toDate())
      .whereIn('configuration_id', configIds)
      // this is probably very inefficient
      .whereRaw('timestamp % 21600 = 0')
    return rows.map(toRecord)
  }

  async getDaily(to: UnixTime, configIds: string[]) {
    const knex = await this.knex()
    const rows = await knex('amounts')
      .where('timestamp', '<', to.toDate())
      .whereIn('configuration_id', configIds)
      // this is probably very inefficient
      .whereRaw('timestamp % 86400 = 0')
    return rows.map(toRecord)
  }

  async addMany(records: AmountRecord[]) {
    const rows: AmountRow[] = records.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('amounts', rows, 10_000)
    return rows.length
  }

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
