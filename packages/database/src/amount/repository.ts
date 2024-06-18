import { UnixTime } from '@l2beat/shared-pure'
import { sql } from 'kysely'
import { PostgresDatabase, Transaction } from '../kysely'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../utils/deleteArchivedRecords'
import { Amount, toRecord, toRow } from './entity'
import { selectAmount } from './select'

export class AmountRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async getByConfigIdsAndTimestamp(
    configIds: string[],
    timestamp: UnixTime,
  ): Promise<Amount[]> {
    const rows = await this.db
      .selectFrom('amounts')
      .select(selectAmount)
      .where((eb) =>
        eb.and([
          eb('configuration_id', 'in', configIds),
          eb('timestamp', '=', timestamp.toDate()),
        ]),
      )
      .orderBy('configuration_id')
      .execute()

    return rows.map(toRecord)
  }

  async getByConfigIdsInRange(
    configIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<Amount[]> {
    const rows = await this.db
      .selectFrom('amounts')
      .select(selectAmount)
      .where((eb) =>
        eb.and([
          eb('configuration_id', 'in', configIds),
          eb('timestamp', '>=', fromInclusive.toDate()),
          eb('timestamp', '<=', toInclusive.toDate()),
        ]),
      )
      .orderBy('timestamp')
      .execute()

    return rows.map(toRecord)
  }

  async getDailyByConfigId(configIds: string[]) {
    const rows = await this.db
      .selectFrom('amounts')
      .select(selectAmount)
      .where((eb) =>
        eb.and([
          eb('configuration_id', 'in', configIds),
          eb(sql`extract(hour from "timestamp") % 24`, '=', '0'),
        ]),
      )
      .orderBy('timestamp')
      .execute()

    return rows.map(toRecord)
  }

  async addMany(records: Amount[], trx?: Transaction) {
    const scope = trx ?? this.db

    const rows = records.map(toRow)

    await scope.insertInto('amounts').values(rows).execute()
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ) {
    return this.db
      .deleteFrom('amounts')
      .where((eb) =>
        eb.and([
          eb('configuration_id', '=', configId),
          eb('timestamp', '>=', fromInclusive.toDate()),
          eb('timestamp', '<=', toInclusive.toDate()),
        ]),
      )
      .execute()
  }

  async deleteByConfigAfter(configId: string, fromExclusive: UnixTime) {
    return this.db
      .deleteFrom('amounts')
      .where((eb) =>
        eb.and([
          eb('configuration_id', '=', configId),
          eb('timestamp', '>', fromExclusive.toDate()),
        ]),
      )
      .execute()
  }

  // #region methods used only in TvlCleaner
  deleteHourlyUntil(dateRange: CleanDateRange) {
    return deleteHourlyUntil(this.db, 'amounts', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange) {
    return deleteSixHourlyUntil(this.db, 'amounts', dateRange)
  }

  async getAll() {
    const rows = await this.db
      .selectFrom('amounts')
      .select(selectAmount)
      .execute()

    return rows.map(toRecord)
  }

  deleteAll() {
    return this.db.deleteFrom('amounts').execute()
  }
}
