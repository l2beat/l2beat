import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { GasFeesTipPayersDaily } from '../kysely/generated/types'

/** A group of transactions and the tips they paid. */
export interface GasFeesTipGroup {
  txCount: number
  tipEth: number
}

/** The day's figures, see the GasFeesTipPayersDaily schema. USD is tipEth times ethUsd. */
export interface GasFeesTipPayersStats {
  ethUsd: number
  /** The cap in atFastTipEth. */
  fastTipGwei: number
  /** Ordinary, under 0.1 gwei. */
  low: GasFeesTipGroup
  /** Ordinary, 0.1 to under 1 gwei. */
  middle: GasFeesTipGroup
  /** Ordinary, 1 to under 2.5 gwei. */
  high: GasFeesTipGroup
  roundTipTxCount: number
  atFastTipEth: number
  nonOrdinary: GasFeesTipGroup
}

/** Tips paid on Ethereum in one UTC day. `timestamp` is the start of the day. */
export type GasFeesTipPayersDailyRecord =
  | ({ timestamp: UnixTime; status: 'complete' } & GasFeesTipPayersStats)
  /** Dune never had the whole day */
  | { timestamp: UnixTime; status: 'missing' }

function toRecord(
  row: Selectable<GasFeesTipPayersDaily>,
): GasFeesTipPayersDailyRecord {
  const timestamp = UnixTime.fromDate(row.timestamp)
  if (row.status !== 'complete') return { timestamp, status: 'missing' }
  const stat = (value: number | null) => {
    if (value === null) {
      throw new Error('Complete tip payers day lacks a figure', {
        cause: { timestamp },
      })
    }
    return value
  }
  return {
    timestamp,
    status: 'complete',
    ethUsd: stat(row.ethUsd),
    fastTipGwei: stat(row.fastTipGwei),
    low: { txCount: stat(row.lowTxCount), tipEth: stat(row.lowTipEth) },
    middle: {
      txCount: stat(row.middleTxCount),
      tipEth: stat(row.middleTipEth),
    },
    high: { txCount: stat(row.highTxCount), tipEth: stat(row.highTipEth) },
    roundTipTxCount: stat(row.roundTipTxCount),
    atFastTipEth: stat(row.atFastTipEth),
    nonOrdinary: {
      txCount: stat(row.nonOrdinaryTxCount),
      tipEth: stat(row.nonOrdinaryTipEth),
    },
  }
}

function toRow(
  record: GasFeesTipPayersDailyRecord,
): Insertable<GasFeesTipPayersDaily> {
  const stats = record.status === 'complete' ? record : undefined
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    status: record.status,
    ethUsd: stats?.ethUsd ?? null,
    fastTipGwei: stats?.fastTipGwei ?? null,
    lowTxCount: stats?.low.txCount ?? null,
    lowTipEth: stats?.low.tipEth ?? null,
    middleTxCount: stats?.middle.txCount ?? null,
    middleTipEth: stats?.middle.tipEth ?? null,
    highTxCount: stats?.high.txCount ?? null,
    highTipEth: stats?.high.tipEth ?? null,
    roundTipTxCount: stats?.roundTipTxCount ?? null,
    atFastTipEth: stats?.atFastTipEth ?? null,
    nonOrdinaryTxCount: stats?.nonOrdinary.txCount ?? null,
    nonOrdinaryTipEth: stats?.nonOrdinary.tipEth ?? null,
  }
}

export class GasFeesTipPayersDailyRepository extends BaseRepository {
  async upsert(record: GasFeesTipPayersDailyRecord): Promise<void> {
    const row = toRow(record)
    const { timestamp: _, ...update } = row
    await this.db
      .insertInto('GasFeesTipPayersDaily')
      .values(row)
      .onConflict((cb) => cb.column('timestamp').doUpdateSet(update))
      .execute()
  }

  /** Oldest first. */
  async getInRange(
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<GasFeesTipPayersDailyRecord[]> {
    const rows = await this.db
      .selectFrom('GasFeesTipPayersDaily')
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
      .deleteFrom('GasFeesTipPayersDaily')
      .where('timestamp', '>', UnixTime.toDate(from))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('GasFeesTipPayersDaily')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
