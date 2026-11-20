import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { ChainHeadCursor } from '../kysely/generated/types'

export interface ChainHeadCursorRecord {
  indexerId: string
  chain: string
  /** The indexer holds everything from this block up to `number` */
  sinceNumber: number
  sinceTimestamp: UnixTime
  /** When the indexer last started over. `since` moves up as old rows are cleaned, this does not */
  startedAt: UnixTime
  number: number
  hash: string
  timestamp: UnixTime
}

function toRecord(row: Selectable<ChainHeadCursor>): ChainHeadCursorRecord {
  return {
    ...row,
    sinceTimestamp: UnixTime.fromDate(row.sinceTimestamp),
    startedAt: UnixTime.fromDate(row.startedAt),
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

function toRow(record: ChainHeadCursorRecord): Insertable<ChainHeadCursor> {
  return {
    ...record,
    sinceTimestamp: UnixTime.toDate(record.sinceTimestamp),
    startedAt: UnixTime.toDate(record.startedAt),
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export class ChainHeadCursorRepository extends BaseRepository {
  async upsert(record: ChainHeadCursorRecord): Promise<void> {
    await this.db
      .insertInto('ChainHeadCursor')
      .values(toRow(record))
      .onConflict((cb) =>
        cb.column('indexerId').doUpdateSet((eb) => ({
          chain: eb.ref('excluded.chain'),
          sinceNumber: eb.ref('excluded.sinceNumber'),
          sinceTimestamp: eb.ref('excluded.sinceTimestamp'),
          startedAt: eb.ref('excluded.startedAt'),
          number: eb.ref('excluded.number'),
          hash: eb.ref('excluded.hash'),
          timestamp: eb.ref('excluded.timestamp'),
        })),
      )
      .execute()
  }

  async findByIndexerId(
    indexerId: string,
  ): Promise<ChainHeadCursorRecord | undefined> {
    const row = await this.db
      .selectFrom('ChainHeadCursor')
      .selectAll()
      .where('indexerId', '=', indexerId)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async deleteByIndexerIds(indexerIds: string[]): Promise<number> {
    if (indexerIds.length === 0) return 0
    const result = await this.db
      .deleteFrom('ChainHeadCursor')
      .where('indexerId', 'in', indexerIds)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<ChainHeadCursorRecord[]> {
    const rows = await this.db
      .selectFrom('ChainHeadCursor')
      .selectAll()
      .orderBy('indexerId')
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('ChainHeadCursor')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
