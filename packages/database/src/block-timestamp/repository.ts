import { UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../utils/deleteArchivedRecords'
import { BlockTimestamp, toRecord, toRow } from './entity'
import { selectBlockTimestamp } from './select'

export class BlockTimestampRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async add(record: BlockTimestamp) {
    const row = toRow(record)

    await this.db.insertInto('public.block_timestamps').values(row).execute()

    return `${record.chain}-${record.timestamp.toNumber()}`
  }

  async findByChainAndTimestamp(chain: string, timestamp: UnixTime) {
    const row = await this.db
      .selectFrom('public.block_timestamps')
      .select(selectBlockTimestamp)
      .where((eb) =>
        eb.and([
          eb('chain', '=', chain),
          eb('timestamp', '=', timestamp.toDate()),
        ]),
      )
      .executeTakeFirst()

    return row ? toRecord(row).blockNumber : null
  }

  async deleteAfterExclusive(chain: string, timestamp: UnixTime) {
    await this.db
      .deleteFrom('public.block_timestamps')
      .where((eb) =>
        eb.and([
          eb('chain', '=', chain),
          eb('timestamp', '>', timestamp.toDate()),
        ]),
      )
      .execute()
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

  async addMany(records: BlockTimestamp[], trx?: Transaction) {
    const rows = records.map(toRow)

    const scope = trx ?? this.db

    await scope.insertInto('public.block_timestamps').values(rows).execute()

    return rows.length
  }

  deleteAll() {
    return this.db.deleteFrom('public.block_timestamps').execute()
  }
}
