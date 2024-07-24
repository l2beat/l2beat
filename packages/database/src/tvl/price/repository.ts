import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../../utils/deleteArchivedRecords'
import { PriceRecord, toRecord, toRow } from './entity'
import { selectPrice } from './select'

export class PriceRepository extends BaseRepository {
  async getByConfigIdsInRange(
    configIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ) {
    if (configIds.length === 0) {
      return []
    }
    const rows = await this.db
      .selectFrom('public.prices')
      .select(selectPrice)
      .where('configuration_id', 'in', configIds)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .orderBy('timestamp')
      .execute()

    return rows.map(toRecord)
  }

  async getByTimestamp(timestamp: UnixTime) {
    const rows = await this.db
      .selectFrom('public.prices')
      .select(selectPrice)
      .where('timestamp', '=', timestamp.toDate())
      .orderBy('timestamp')
      .execute()

    return rows.map(toRecord)
  }

  async findByConfigAndTimestamp(configId: string, timestamp: UnixTime) {
    const row = await this.db
      .selectFrom('public.prices')
      .select(selectPrice)
      .where('configuration_id', '=', configId)
      .where('timestamp', '=', timestamp.toDate())
      .executeTakeFirst()

    return row ? toRecord(row) : null
  }

  async addMany(records: PriceRecord[]) {
    if (records.length === 0) {
      return 0
    }

    const rows = records.map(toRow)

    await this.batch(rows, 10_000, async (trx, batch) => {
      await trx.insertInto('public.prices').values(batch).execute()
    })

    return rows.length
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('public.prices')
      .where('configuration_id', '=', configId)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  deleteHourlyUntil(dateRange: CleanDateRange) {
    return deleteHourlyUntil(this.db, 'public.prices', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange) {
    return deleteSixHourlyUntil(this.db, 'public.prices', dateRange)
  }

  async getAll() {
    const rows = await this.db.selectFrom('public.prices').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('public.prices').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
