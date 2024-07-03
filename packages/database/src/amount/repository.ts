import { UnixTime } from '@l2beat/shared-pure'
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

  async getByTimestamp(timestamp: UnixTime) {
    const rows = await this.db
      .selectFrom('public.amounts')
      .select(selectAmount)
      .where((eb) => eb.and([eb('timestamp', '=', timestamp.toDate())]))
      .orderBy('timestamp')
      .execute()

    return rows.map(toRecord)
  }

  async getByConfigIdsInRange(
    configIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<Amount[]> {
    const rows = await this.db
      .selectFrom('public.amounts')
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

  async addMany(records: Amount[], trx?: Transaction) {
    if (records.length === 0) {
      return
    }
    const scope = trx ?? this.db

    const rows = records.map(toRow)

    await scope.insertInto('public.amounts').values(rows).execute()
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ) {
    return this.db
      .deleteFrom('public.amounts')
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
      .deleteFrom('public.amounts')
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
    return deleteHourlyUntil(this.db, 'public.amounts', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange) {
    return deleteSixHourlyUntil(this.db, 'public.amounts', dateRange)
  }

  async getAll() {
    const rows = await this.db
      .selectFrom('public.amounts')
      .select(selectAmount)
      .execute()

    return rows.map(toRecord)
  }

  deleteAll() {
    return this.db.deleteFrom('public.amounts').execute()
  }
}
