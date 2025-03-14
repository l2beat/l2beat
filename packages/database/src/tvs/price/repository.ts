import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import {
  type CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../../utils/deleteArchivedRecords'
import { type TvsPriceRecord, toRecord, toRow } from './entity'

export class TvsPriceRepository extends BaseRepository {
  async insertMany(records: TvsPriceRecord[]) {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('TvsPrice').values(batch).execute()
    })
    return rows.length
  }

  async deleteByConfigInTimeRange(
    priceId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('TvsPrice')
      .where('priceId', '=', priceId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  deleteHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteHourlyUntil(this.db, 'TvsPrice', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteSixHourlyUntil(this.db, 'TvsPrice', dateRange)
  }

  async getAll(): Promise<TvsPriceRecord[]> {
    const rows = await this.db.selectFrom('TvsPrice').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TvsPrice').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
