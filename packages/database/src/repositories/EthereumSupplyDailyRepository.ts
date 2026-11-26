import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { EthereumSupplyDaily } from '../kysely/generated/types'

/** ETH in existence as a UTC day starts. */
export interface EthereumSupplyDailyRecord {
  /** Start of the day. */
  timestamp: UnixTime
  /** In ETH; a known supply on the first day, plus issuance and less burn since. */
  supply: number
}

function toRecord(
  row: Selectable<EthereumSupplyDaily>,
): EthereumSupplyDailyRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    supply: row.supply,
  }
}

function toRow(
  record: EthereumSupplyDailyRecord,
): Insertable<EthereumSupplyDaily> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    supply: record.supply,
  }
}

export class EthereumSupplyDailyRepository extends BaseRepository {
  async upsertMany(records: EthereumSupplyDailyRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('EthereumSupplyDaily')
        .values(batch)
        .onConflict((cb) =>
          cb.column('timestamp').doUpdateSet((eb) => ({
            supply: eb.ref('excluded.supply'),
          })),
        )
        .execute()
    })
    return rows.length
  }

  /** Oldest first. */
  async getInRange(
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<EthereumSupplyDailyRecord[]> {
    const rows = await this.db
      .selectFrom('EthereumSupplyDaily')
      .selectAll()
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  /** Removes the days after `from`, for an indexer invalidating its height. */
  async deleteAfter(from: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('EthereumSupplyDaily')
      .where('timestamp', '>', UnixTime.toDate(from))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<EthereumSupplyDailyRecord[]> {
    const rows = await this.db
      .selectFrom('EthereumSupplyDaily')
      .selectAll()
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('EthereumSupplyDaily')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
