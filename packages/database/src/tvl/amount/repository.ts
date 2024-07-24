import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../../utils/deleteArchivedRecords'
import { AmountRecord, toRecord, toRow } from './entity'
import { selectAmount } from './select'

export class AmountRepository extends BaseRepository {
  async getByIdsAndTimestamp(configIds: string[], timestamp: UnixTime) {
    if (configIds.length === 0) {
      return []
    }

    const rows = await this.getDb()
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
    if (configIds.length === 0) {
      return []
    }

    const rows = await this.getDb()
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
    if (timestamps.length === 0) {
      return []
    }

    const rows = await this.getDb()
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

  async addMany(records: AmountRecord[]) {
    if (records.length === 0) {
      return
    }

    const rows = records.map(toRow)

    await this.batch(rows, 1_000, async (trx, batch) => {
      await trx.insertInto('public.amounts').values(batch).execute()
    })

    return rows.length
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.getDb()
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
    const result = await this.getDb()
      .deleteFrom('public.amounts')
      .where('configuration_id', '=', configId)
      .where('timestamp', '>', fromExclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // #region methods used only in TvlCleaner
  deleteHourlyUntil(dateRange: CleanDateRange) {
    return deleteHourlyUntil(this.getDb(), 'public.amounts', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange) {
    return deleteSixHourlyUntil(this.getDb(), 'public.amounts', dateRange)
  }

  async getAll() {
    const rows = await this.getDb()
      .selectFrom('public.amounts')
      .select(selectAmount)
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.getDb()
      .deleteFrom('public.amounts')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
