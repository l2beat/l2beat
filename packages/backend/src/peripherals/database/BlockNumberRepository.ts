import { Knex } from 'knex'

import { UnixTime } from '../../model/UnixTime'

export interface BlockNumberRecord {
  timestamp: UnixTime
  blockNumber: bigint
}

export interface IBlockNumberRepository {
  add(entry: BlockNumberRecord): Promise<void>
  getAll(): Promise<BlockNumberRecord[]>
  deleteAll(): Promise<void>
}

export class BlockNumberRepository implements IBlockNumberRepository {
  constructor(private knex: Knex) {}

  async add(entry: BlockNumberRecord) {
    await this.knex('block_numbers').insert({
      unix_timestamp: entry.timestamp.toString(),
      block_number: Number(entry.blockNumber),
    })
  }

  async getAll(): Promise<BlockNumberRecord[]> {
    const result = await this.knex('block_numbers').select(
      'unix_timestamp',
      'block_number'
    )
    return result.map((x) => ({
      timestamp: new UnixTime(+x.unix_timestamp),
      blockNumber: BigInt(x.block_number),
    }))
  }

  async deleteAll() {
    await this.knex('block_numbers').delete()
  }
}
