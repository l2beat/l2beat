import { Logger, UnixTime } from '@l2beat/common'
import { Knex } from 'knex'
import { BlockNumberRow } from 'knex/types/tables'

import { BaseRepository } from './BaseRepository'

export interface BlockNumberRecord {
  timestamp: UnixTime
  blockNumber: bigint
}

export class BlockNumberRepository extends BaseRepository {
  constructor(knex: Knex, logger: Logger) {
    super(knex, logger)
    this.add = this.wrapAdd(this.add)
    this.getAll = this.wrapGet(this.getAll)
    this.deleteAll = this.wrapDelete(this.deleteAll)
  }

  async add(record: BlockNumberRecord) {
    const row = toRow(record)
    const [id] = await this.knex('block_numbers')
      .insert(row)
      .returning('block_number')
    return id
  }

  async getAll(): Promise<BlockNumberRecord[]> {
    const rows = await this.knex('block_numbers').select(
      'unix_timestamp',
      'block_number'
    )
    return rows.map(toRecord)
  }

  async deleteAll() {
    return await this.knex('block_numbers').delete()
  }
}

function toRow(record: BlockNumberRecord): BlockNumberRow {
  return {
    unix_timestamp: record.timestamp.toString(),
    block_number: Number(record.blockNumber),
  }
}

function toRecord(row: BlockNumberRow): BlockNumberRecord {
  return {
    timestamp: new UnixTime(+row.unix_timestamp),
    blockNumber: BigInt(row.block_number),
  }
}
