import { UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../../kysely'
import { batchExecute } from '../../utils/batchExecute'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../../utils/deleteArchivedRecords'
import { BlockTimestampRecord, toRecord, toRow } from './entity'
import { selectBlockTimestamp } from './select'

export class BlockTimestampRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async add(record: BlockTimestampRecord) {
    const row = toRow(record)

    await this.db.insertInto('public.block_timestamps').values(row).execute()

    return `${record.chain}-${record.timestamp.toNumber()}`
  }

  async findByChainAndTimestamp(chain: string, timestamp: UnixTime) {
    const row = await this.db
      .selectFrom('public.block_timestamps')
      .select(selectBlockTimestamp)
      .where('chain', '=', chain)
      .where('timestamp', '=', timestamp.toDate())
      .executeTakeFirst()

    return row ? toRecord(row).blockNumber : null
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
  deleteHourlyUntil(dateRange: CleanDateRange) {
    return deleteHourlyUntil(this.db, 'public.block_timestamps', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange) {
    return deleteSixHourlyUntil(this.db, 'public.block_timestamps', dateRange)
  }
  // #endregion

  async getAll() {
    const rows = await this.db
      .selectFrom('public.block_timestamps')
      .select(selectBlockTimestamp)
      .execute()

    return rows.map(toRecord)
  }

  async addMany(records: BlockTimestampRecord[], trx?: Transaction) {
    if (records.length === 0) {
      return 0
    }

    const scope = trx ?? this.db
    const rows = records.map(toRow)

    await batchExecute(scope, rows, 2_000, async (trx, batch) => {
      await trx.insertInto('public.block_timestamps').values(batch).execute()
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
