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

  async addMany(records: AmountRecord[]) {
    const rows: AmountRow[] = records.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('amounts', rows, 10_000)
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
