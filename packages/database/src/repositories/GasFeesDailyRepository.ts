import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { GasFeesDaily } from '../kysely/generated/types'

/** One UTC day of fees on one chain. Native amounts are in the chain's gas token. */
export interface GasFeesDailyRecord {
  /** Start of the day. */
  timestamp: UnixTime
  /** The gas fees page's chain id. */
  chain: string
  txCount: number
  totalFeeNative: number
  /** A day with a fee Dune has no price for is not stored */
  totalFeeUsd: number
  l1FeeNative: number
  blobFeeNative: number
  /** Each block's base fee per gas times the gas of its transactions that paid. null where the chain had no base fee. On Arbitrum, and on Mantle until 22 April 2026, it already contains l1FeeNative */
  baseFeeNative: number | null
  /** Of the transactions that paid a fee */
  gasUsed: number
  /** null when no transaction paid a fee */
  medianFeeUsd: number | null
}

function toRecord(row: Selectable<GasFeesDaily>): GasFeesDailyRecord {
  return { ...row, timestamp: UnixTime.fromDate(row.timestamp) }
}

function toRow(record: GasFeesDailyRecord): Insertable<GasFeesDaily> {
  return { ...record, timestamp: UnixTime.toDate(record.timestamp) }
}

export class GasFeesDailyRepository extends BaseRepository {
  async upsertMany(records: GasFeesDailyRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('GasFeesDaily')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['chain', 'timestamp']).doUpdateSet((eb) => ({
            txCount: eb.ref('excluded.txCount'),
            totalFeeNative: eb.ref('excluded.totalFeeNative'),
            totalFeeUsd: eb.ref('excluded.totalFeeUsd'),
            l1FeeNative: eb.ref('excluded.l1FeeNative'),
            blobFeeNative: eb.ref('excluded.blobFeeNative'),
            baseFeeNative: eb.ref('excluded.baseFeeNative'),
            gasUsed: eb.ref('excluded.gasUsed'),
            medianFeeUsd: eb.ref('excluded.medianFeeUsd'),
          })),
        )
        .execute()
    })
    return rows.length
  }

  /** Every chain, oldest first. */
  async getInRange(
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<GasFeesDailyRecord[]> {
    const rows = await this.db
      .selectFrom('GasFeesDaily')
      .selectAll()
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')
      .orderBy('chain', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  /** Removes the days after `from`, for an indexer invalidating its height. */
  async deleteAfter(from: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('GasFeesDaily')
      .where('timestamp', '>', UnixTime.toDate(from))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('GasFeesDaily').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
