import { Knex } from 'knex'

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
    const row = {
      unix_timestamp: record.timestamp.toString(),
      block_number: Number(record.blockNumber),
    }
    await this.knex('block_numbers').insert(row)
    this.logger.debug({ method: 'add', ...row })
  }

  async getAll(): Promise<BlockNumberRecord[]> {
    const result = await this.knex('block_numbers').select(
      'unix_timestamp',
      'block_number'
    )
    this.logger.debug({ method: 'getAll', rows: result.length })
    return result.map((x) => ({
      timestamp: new UnixTime(+x.unix_timestamp),
      blockNumber: BigInt(x.block_number),
    }))
  }

  async deleteAll() {
    await this.knex('block_numbers').delete()
    this.logger.debug({ method: 'deleteAll' })
  }
}
