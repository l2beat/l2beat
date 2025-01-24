import type { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import {
  type CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../../utils/deleteArchivedRecords'
import { type PriceRecord, toRecord, toRow } from './entity'
import { selectPrice } from './select'

export class PriceRepository extends BaseRepository {
  async getByConfigIdsInRange(
    configIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<PriceRecord[]> {
    if (configIds.length === 0) return []

    const rows = await this.db
      .selectFrom('Price')
      .select(selectPrice)
      .where('configurationId', 'in', configIds)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .orderBy('timestamp')
      .execute()
    return rows.map(toRecord)
  }

  async getLatestPrice(configIds: string[]): Promise<PriceRecord | undefined> {
    if (configIds.length === 0) return undefined

    const row = await this.db
      .selectFrom('Price')
      .select(selectPrice)
      .where('configurationId', 'in', configIds)
      .orderBy('timestamp', 'desc')
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getByTimestamp(timestamp: UnixTime): Promise<PriceRecord[]> {
    const rows = await this.db
      .selectFrom('Price')
      .select(selectPrice)
      .where('timestamp', '=', timestamp.toDate())
      .orderBy('timestamp')
      .execute()
    return rows.map(toRecord)
  }

  async findByConfigAndTimestamp(
    configId: string,
    timestamp: UnixTime,
  ): Promise<PriceRecord | undefined> {
    const row = await this.db
      .selectFrom('Price')
      .select(selectPrice)
      .where('configurationId', '=', configId)
      .where('timestamp', '=', timestamp.toDate())
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async insertMany(records: PriceRecord[]) {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('Price').values(batch).execute()
    })
    return rows.length
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('Price')
      .where('configurationId', '=', configId)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  deleteHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteHourlyUntil(this.db, 'Price', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteSixHourlyUntil(this.db, 'Price', dateRange)
  }

  async getAll(): Promise<PriceRecord[]> {
    const rows = await this.db.selectFrom('Price').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Price').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
