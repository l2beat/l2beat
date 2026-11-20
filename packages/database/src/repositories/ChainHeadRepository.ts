import { UnixTime } from '@l2beat/shared-pure'
import type { Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { ChainHead } from '../kysely/generated/types'

export interface ChainHeadRecord {
  chain: string
  /** The newest stored block */
  number: number
  /** When the source last had no block newer than the stored ones */
  confirmedAt: UnixTime
}

function toRecord(row: Selectable<ChainHead>): ChainHeadRecord {
  return { ...row, confirmedAt: UnixTime.fromDate(row.confirmedAt) }
}

export class ChainHeadRepository extends BaseRepository {
  async upsert(record: ChainHeadRecord): Promise<void> {
    const row = {
      ...record,
      confirmedAt: UnixTime.toDate(record.confirmedAt),
    }
    await this.db
      .insertInto('ChainHead')
      .values(row)
      .onConflict((cb) =>
        cb.column('chain').doUpdateSet((eb) => ({
          number: eb.ref('excluded.number'),
          confirmedAt: eb.ref('excluded.confirmedAt'),
        })),
      )
      .execute()
  }

  async getAll(): Promise<ChainHeadRecord[]> {
    const rows = await this.db.selectFrom('ChainHead').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('ChainHead').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
