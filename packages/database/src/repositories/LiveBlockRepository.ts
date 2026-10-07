import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { LiveBlock } from '../kysely/generated/types'

/** An Ethereum block of the last day or so, for the live blobs view */
export interface LiveBlockRecord {
  slot: number
  blockNumber: number
  hash: string
  timestamp: UnixTime
  blobCount: number
}

/** Stored slots from oldest to newest; the ones in between with no block were missed */
export interface LiveSlotRange {
  from: number
  to: number
  blocks: number
}

export function toRecord(row: Selectable<LiveBlock>): LiveBlockRecord {
  return { ...row, timestamp: UnixTime.fromDate(row.timestamp) }
}

export function toRow(record: LiveBlockRecord): Insertable<LiveBlock> {
  return { ...record, timestamp: UnixTime.toDate(record.timestamp) }
}

export class LiveBlockRepository extends BaseRepository {
  async upsertMany(records: LiveBlockRecord[]): Promise<number> {
    if (records.length === 0) return 0

    await this.batch(records.map(toRow), 5_000, async (batch) => {
      await this.db
        .insertInto('LiveBlock')
        .values(batch)
        .onConflict((cb) =>
          cb.column('slot').doUpdateSet((eb) => ({
            blockNumber: eb.ref('excluded.blockNumber'),
            hash: eb.ref('excluded.hash'),
            timestamp: eb.ref('excluded.timestamp'),
            blobCount: eb.ref('excluded.blobCount'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async getAll(): Promise<LiveBlockRecord[]> {
    const rows = await this.db
      .selectFrom('LiveBlock')
      .selectAll()
      .orderBy('slot')
      .execute()
    return rows.map(toRecord)
  }

  async findHead(): Promise<LiveBlockRecord | undefined> {
    const row = await this.db
      .selectFrom('LiveBlock')
      .selectAll()
      .orderBy('slot', 'desc')
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getSlotRange(fromSlot = 0): Promise<LiveSlotRange | undefined> {
    const row = await this.db
      .selectFrom('LiveBlock')
      .select((eb) => [
        eb.fn.min('slot').as('from'),
        eb.fn.max('slot').as('to'),
        eb.fn.countAll<string>().as('blocks'),
      ])
      .where('slot', '>=', fromSlot)
      .executeTakeFirstOrThrow()
    if (row.from === null || row.to === null) return undefined
    return { from: row.from, to: row.to, blocks: Number(row.blocks) }
  }

  /** Both ends included, oldest first */
  async getBySlotRange(from: number, to: number): Promise<LiveBlockRecord[]> {
    const rows = await this.db
      .selectFrom('LiveBlock')
      .selectAll()
      .where('slot', '>=', from)
      .where('slot', '<=', to)
      .orderBy('slot')
      .execute()
    return rows.map(toRecord)
  }

  /** Both ends included, oldest first */
  async getByBlockNumberRange(
    from: number,
    to: number,
  ): Promise<LiveBlockRecord[]> {
    const rows = await this.db
      .selectFrom('LiveBlock')
      .selectAll()
      .where('blockNumber', '>=', from)
      .where('blockNumber', '<=', to)
      .orderBy('blockNumber')
      .execute()
    return rows.map(toRecord)
  }

  async deleteBeforeBlock(blockNumber: number): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveBlock')
      .where('blockNumber', '<', blockNumber)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAfterBlock(blockNumber: number): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveBlock')
      .where('blockNumber', '>', blockNumber)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('LiveBlock').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
