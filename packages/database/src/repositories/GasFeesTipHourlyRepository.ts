import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { GasFeesTipHourly } from '../kysely/generated/types'

export type GasFeesTier = 'slow' | 'medium' | 'fast'

/** Our estimator's tips, gwei, as of a moment, from the blocks before it. */
export interface GasFeesTipsReading {
  /** The newest block read. */
  blockNumber: number
  slowTipGwei: number
  mediumTipGwei: number
  fastTipGwei: number
  /** Chainlink ETH/USD at blockNumber. */
  ethUsd: number
}

export interface GasFeesTipHourlyRecord extends GasFeesTipsReading {
  /** Start of the hour; blockNumber is the last block before it. */
  timestamp: UnixTime
}

function toRecord(row: Selectable<GasFeesTipHourly>): GasFeesTipHourlyRecord {
  return { ...row, timestamp: UnixTime.fromDate(row.timestamp) }
}

function toRow(record: GasFeesTipHourlyRecord): Insertable<GasFeesTipHourly> {
  return { ...record, timestamp: UnixTime.toDate(record.timestamp) }
}

export class GasFeesTipHourlyRepository extends BaseRepository {
  async upsertMany(records: GasFeesTipHourlyRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('GasFeesTipHourly')
        .values(batch)
        .onConflict((cb) =>
          cb.column('timestamp').doUpdateSet((eb) => ({
            blockNumber: eb.ref('excluded.blockNumber'),
            slowTipGwei: eb.ref('excluded.slowTipGwei'),
            mediumTipGwei: eb.ref('excluded.mediumTipGwei'),
            fastTipGwei: eb.ref('excluded.fastTipGwei'),
            ethUsd: eb.ref('excluded.ethUsd'),
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
  ): Promise<GasFeesTipHourlyRecord[]> {
    const rows = await this.db
      .selectFrom('GasFeesTipHourly')
      .selectAll()
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  /** Removes the hours after `from`, for an indexer invalidating its height. */
  async deleteAfter(from: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('GasFeesTipHourly')
      .where('timestamp', '>', UnixTime.toDate(from))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('GasFeesTipHourly')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
