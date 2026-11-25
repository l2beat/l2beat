import { UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { GasFeesLiveTips } from '../kysely/generated/types'
import type { GasFeesTipsReading } from './GasFeesTipHourlyRepository'

export interface GasFeesLiveTipsRecord extends GasFeesTipsReading {
  updatedAt: UnixTime
}

function toRecord(row: Selectable<GasFeesLiveTips>): GasFeesLiveTipsRecord {
  return { ...row, updatedAt: UnixTime.fromDate(row.updatedAt) }
}

function toRow(record: GasFeesLiveTipsRecord): Insertable<GasFeesLiveTips> {
  return { ...record, updatedAt: UnixTime.toDate(record.updatedAt) }
}

/** Holds at most one row: the backend replaces it as blocks arrive. */
export class GasFeesLiveTipsRepository extends BaseRepository {
  async find(): Promise<GasFeesLiveTipsRecord | undefined> {
    const row = await this.db
      .selectFrom('GasFeesLiveTips')
      .selectAll()
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async replace(record: GasFeesLiveTipsRecord): Promise<void> {
    await this.transaction(async () => {
      // Two writers at once would each delete nothing and insert their own row.
      await sql`LOCK TABLE "GasFeesLiveTips" IN EXCLUSIVE MODE`.execute(this.db)
      await this.db.deleteFrom('GasFeesLiveTips').execute()
      await this.db
        .insertInto('GasFeesLiveTips')
        .values(toRow(record))
        .execute()
    })
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('GasFeesLiveTips')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
