import type { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import {
  type CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../../utils/deleteArchivedRecords'
import { type AmountRecord, toRecord, toRow } from './entity'
import { selectAmount } from './select'

export class AmountRepository extends BaseRepository {
  async getByIdsAndTimestamp(
    configIds: string[],
    timestamp: UnixTime,
  ): Promise<AmountRecord[]> {
    if (configIds.length === 0) return []

    const rows = await this.db
      .selectFrom('Amount')
      .select(selectAmount)
      .where('configurationId', 'in', configIds)
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
    if (configIds.length === 0) return []

    const rows = await this.db
      .selectFrom('Amount')
      .select(selectAmount)
      .where('configurationId', 'in', configIds)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .orderBy('timestamp')
      .execute()
    return rows.map(toRecord)
  }

  async getByTimestamps(timestamps: UnixTime[]): Promise<AmountRecord[]> {
    if (timestamps.length === 0) return []

    const rows = await this.db
      .selectFrom('Amount')
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

  async insertMany(records: AmountRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('Amount').values(batch).execute()
    })
    return rows.length
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('Amount')
      .where('configurationId', '=', configId)
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
      .deleteFrom('Amount')
      .where('configurationId', '=', configId)
      .where('timestamp', '>', fromExclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // #region methods used only in TvlCleaner
  deleteHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteHourlyUntil(this.db, 'Amount', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteSixHourlyUntil(this.db, 'Amount', dateRange)
  }

  async getAll(): Promise<AmountRecord[]> {
    const rows = await this.db
      .selectFrom('Amount')
      .select(selectAmount)
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Amount').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
