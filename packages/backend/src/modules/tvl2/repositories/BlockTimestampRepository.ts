import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'

export interface BlockTimestampRecord {
  chain: string
  timestamp: UnixTime
  blockNumber: number
}

export interface BlockTimestampRow {
  chain: string
  timestamp: Date
  block_number: number
}

export class BlockTimestampRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<BlockTimestampRepository>>(this)
  }

  async add(record: BlockTimestampRecord) {
    const row: BlockTimestampRow = toRow(record)
    const knex = await this.knex()
    await knex('block_timestamps').insert(row)

    return `${record.chain}-${record.timestamp.toNumber()}`
  }

  async findByChainAndTimestamp(
    chain: string,
    timestamp: UnixTime,
  ): Promise<BlockTimestampRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('block_timestamps')
      .where('chain', chain)
      .where('timestamp', timestamp.toDate())
      .first()

    return row ? toRecord(row) : undefined
  }

  async deleteAfterExclusive(chain: string, timestamp: UnixTime) {
    const knex = await this.knex()

    return knex('block_timestamps')
      .where('chain', chain)
      .where('timestamp', '>', timestamp.toDate())
      .delete()
  }

  // #region methods used only in tests

  async getAll(): Promise<BlockTimestampRecord[]> {
    const knex = await this.knex()
    const rows = await knex('block_timestamps')
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('block_timestamps').delete()
  }

  // #endregion
}

function toRecord(row: BlockTimestampRow): BlockTimestampRecord {
  return {
    chain: row.chain,
    timestamp: UnixTime.fromDate(row.timestamp),
    blockNumber: +row.block_number,
  }
}

function toRow(record: BlockTimestampRecord): BlockTimestampRow {
  return {
    chain: record.chain,
    timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
  }
}
