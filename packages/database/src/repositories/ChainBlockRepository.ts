import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { ChainBlock } from '../kysely/generated/types'

export interface ChainBlockRecord {
  chain: string
  number: number
  hash: string
  parentHash: string
  timestamp: UnixTime
  /** Null where the chain's bloom is not of the block's own logs */
  logsBloom: string | null
}

function toRecord(row: Selectable<ChainBlock>): ChainBlockRecord {
  return { ...row, timestamp: UnixTime.fromDate(row.timestamp) }
}

function toRow(record: ChainBlockRecord): Insertable<ChainBlock> {
  return { ...record, timestamp: UnixTime.toDate(record.timestamp) }
}

export class ChainBlockRepository extends BaseRepository {
  async upsertMany(records: ChainBlockRecord[]): Promise<number> {
    if (records.length === 0) return 0

    await this.batch(records.map(toRow), 5_000, async (batch) => {
      await this.db
        .insertInto('ChainBlock')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['chain', 'number']).doUpdateSet((eb) => ({
            hash: eb.ref('excluded.hash'),
            parentHash: eb.ref('excluded.parentHash'),
            timestamp: eb.ref('excluded.timestamp'),
            logsBloom: eb.ref('excluded.logsBloom'),
          })),
        )
        .execute()
    })
    return records.length
  }

  /** The chain's newest blocks, oldest first */
  async getNewest(chain: string, limit: number): Promise<ChainBlockRecord[]> {
    const rows = await this.db
      .selectFrom('ChainBlock')
      .selectAll()
      .where('chain', '=', chain)
      .orderBy('number', 'desc')
      .limit(limit)
      .execute()
    return rows.map(toRecord).reverse()
  }

  /** Both ends included, oldest first */
  async getByNumberRange(
    chain: string,
    from: number,
    to: number,
  ): Promise<ChainBlockRecord[]> {
    const rows = await this.db
      .selectFrom('ChainBlock')
      .selectAll()
      .where('chain', '=', chain)
      .where('number', '>=', from)
      .where('number', '<=', to)
      .orderBy('number')
      .execute()
    return rows.map(toRecord)
  }

  async deleteAfter(chain: string, number: number): Promise<number> {
    const result = await this.db
      .deleteFrom('ChainBlock')
      .where('chain', '=', chain)
      .where('number', '>', number)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByChain(chain: string): Promise<number> {
    const result = await this.db
      .deleteFrom('ChainBlock')
      .where('chain', '=', chain)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteBefore(chain: string, timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('ChainBlock')
      .where('chain', '=', chain)
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('ChainBlock').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
