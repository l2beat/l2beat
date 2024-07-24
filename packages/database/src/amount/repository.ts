import { UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { batchExecute } from '../utils/batchExecute'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../utils/deleteArchivedRecords'
import { AmountRecord, toRecord, toRow } from './entity'
import { selectAmount } from './select'

export class AmountRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async getByIdsAndTimestamp(configIds: string[], timestamp: UnixTime) {
    const rows = await this.db
      .selectFrom('public.amounts')
      .select(selectAmount)
      .where('configuration_id', 'in', configIds)
      .where('timestamp', '=', timestamp.toDate())
      .orderBy('timestamp')
      .execute()

    return rows.map(toRecord)
  }

  async getByConfigIdsInRange(
    configIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<AmountRecord[]> {
    const rows = await this.db
      .selectFrom('public.amounts')
      .select(selectAmount)
      .where('configuration_id', 'in', configIds)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .orderBy('timestamp')
      .execute()

    return rows.map(toRecord)
  }

  async getByTimestamps(timestamps: UnixTime[]) {
    const rows = await this.db
      .selectFrom('public.amounts')
      .select(selectAmount)
      .where(
        'timestamp',
        'in',
        timestamps.map((t) => t.toDate()),
      )
      .orderBy('timestamp')
      .execute()

    return rows.map(toRecord)
  }

  async addMany(records: AmountRecord[], trx?: Transaction) {
    if (records.length === 0) {
      return
    }

    const scope = trx ?? this.db
    const rows = records.map(toRow)

    await batchExecute(scope, rows, 1_000, async (trx, batch) => {
      await trx.insertInto('public.amounts').values(batch).execute()
    })

    return rows.length
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('public.amounts')
      .where('configuration_id', '=', configId)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigAfter(
    configId: string,
    fromExclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('public.amounts')
      .where('configuration_id', '=', configId)
      .where('timestamp', '>', fromExclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
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

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('public.amounts').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
