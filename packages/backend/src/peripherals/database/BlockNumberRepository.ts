import { Logger } from '@l2beat/shared'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { BlockNumberRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface BlockNumberRecord {
  timestamp: UnixTime
  blockNumber: number
  chainId: ChainId
}

export class BlockNumberRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<BlockNumberRepository>>(this)
  }

  async add(record: BlockNumberRecord) {
    const row = toRow(record)
    const knex = await this.knex()
    await knex('block_numbers').insert(row)
    return `[chainId | ${record.chainId.toString()}]: ${Number(
      record.blockNumber,
    )}`
  }

  async getAll(chainId: ChainId): Promise<BlockNumberRecord[]> {
    const knex = await this.knex()
    const rows = await knex('block_numbers')
      .where('chain_id', '=', Number(chainId))
      .select('unix_timestamp', 'block_number', 'chain_id')
    return rows.map(toRecord)
  }

  async findByTimestamp(
    chainId: ChainId,
    timestamp: UnixTime,
  ): Promise<BlockNumberRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('block_numbers')
      .where('unix_timestamp', '=', timestamp.toDate())
      .andWhere('chain_id', '=', Number(chainId))
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
    chain_id: Number(record.chainId),
  }
}

function toRecord(row: BlockNumberRow): BlockNumberRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    blockNumber: row.block_number,
    chainId: ChainId(row.chain_id),
  }
}
