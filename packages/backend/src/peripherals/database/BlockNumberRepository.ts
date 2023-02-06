import { Logger, UnixTime } from '@l2beat/shared'
import { BlockNumberRow } from 'knex/types/tables'

import { Metrics } from '../../Metrics'
import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface BlockNumberRecord {
  timestamp: UnixTime
  blockNumber: number
}

export class BlockNumberRepository extends BaseRepository {
  constructor(database: Database, logger: Logger, metrics: Metrics) {
    super(database, logger, metrics)
    this.autoWrap<CheckConvention<BlockNumberRepository>>(this)
  }

  async add(record: BlockNumberRecord) {
    const row = toRow(record)
    const knex = await this.knex()
    await knex('block_numbers').insert(row)
    return Number(record.blockNumber)
  }

  async getAll(): Promise<BlockNumberRecord[]> {
    const knex = await this.knex()
    const rows = await knex('block_numbers').select(
      'unix_timestamp',
      'block_number',
    )
    return rows.map(toRecord)
  }

  async findByTimestamp(
    timestamp: UnixTime,
  ): Promise<BlockNumberRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('block_numbers')
      .where('unix_timestamp', '=', timestamp.toDate())
      .first()
    return row ? toRecord(row) : undefined
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('block_numbers').delete()
  }
}

function toRow(record: BlockNumberRecord): BlockNumberRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
  }
}

function toRecord(row: BlockNumberRow): BlockNumberRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    blockNumber: row.block_number,
  }
}
