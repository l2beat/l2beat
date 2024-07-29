import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../../utils/deleteArchivedRecords'
import { BlockTimestampRecord, toRecord, toRow } from './entity'
import { selectBlockTimestamp } from './select'

export class BlockTimestampRepository extends BaseRepository {
  async insert(record: BlockTimestampRecord): Promise<void> {
    await this.insertMany([record])
  }

  async findBlockNumberByChainAndTimestamp(
    chain: string,
    timestamp: UnixTime,
  ): Promise<number | undefined> {
    const row = await this.db
      .selectFrom('public.block_timestamps')
      .select('block_number')
      .where('chain', '=', chain)
      .where('timestamp', '=', timestamp.toDate())
      .limit(1)
      .executeTakeFirst()
    return row?.block_number
  }

  async deleteAfterExclusive(
    chain: string,
    timestamp: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('public.block_timestamps')
      .where('chain', '=', chain)
      .where('timestamp', '>', timestamp.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // #region methods used only in TvlCleaner
  deleteHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteHourlyUntil(this.db, 'public.block_timestamps', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteSixHourlyUntil(this.db, 'public.block_timestamps', dateRange)
  }
  // #endregion

  async getAll(): Promise<BlockTimestampRecord[]> {
    const rows = await this.db
      .selectFrom('public.block_timestamps')
      .select(selectBlockTimestamp)
      .execute()
    return rows.map(toRecord)
  }

  async insertMany(records: BlockTimestampRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('public.block_timestamps')
        .values(batch)
        .execute()
    })
    return rows.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.block_timestamps')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
