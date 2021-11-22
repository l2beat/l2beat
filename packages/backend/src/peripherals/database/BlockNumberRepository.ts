import { Knex } from 'knex'
import { BlockNumberRow } from 'knex/types/tables'

import { UnixTime } from '../../model/UnixTime'
import { Logger } from '../../tools/Logger'

export interface BlockNumberRecord {
  timestamp: UnixTime
  blockNumber: bigint
}

export class BlockNumberRepository {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async add(record: BlockNumberRecord) {
    const row = toRow(record)
    await this.knex('block_numbers').insert(row)
    this.logger.debug({ method: 'add', ...row })
  }

  async getAll(): Promise<BlockNumberRecord[]> {
    const rows = await this.knex('block_numbers').select(
      'unix_timestamp',
      'block_number'
    )
    this.logger.debug({ method: 'getAll', rows: rows.length })
    return rows.map(toRecord)
  }

  async deleteAll() {
    await this.knex('block_numbers').delete()
    this.logger.debug({ method: 'deleteAll' })
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
