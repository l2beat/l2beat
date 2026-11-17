import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { GasFeesTipPayersDaily } from '../kysely/generated/types'

/** A group of transactions and the tips they paid. */
export interface GasFeesTipGroup {
  txCount: number
  tipEth: number
  tipUsd: number
}

/** Tips paid on Ethereum in one UTC day, see the GasFeesTipPayersDaily schema. */
export interface GasFeesTipPayersDailyRecord {
  /** Start of the day. */
  timestamp: UnixTime
  ethUsd: number
  /** The cap in atFastTip. */
  fastTipGwei: number
  /** Ordinary, under 0.1 gwei. */
  low: GasFeesTipGroup
  /** Ordinary, 0.1 to under 1 gwei. */
  middle: GasFeesTipGroup
  /** Ordinary, 1 to under 2.5 gwei. */
  high: GasFeesTipGroup
  roundTipTxCount: number
  atFastTipEth: number
  atFastTipUsd: number
  nonOrdinary: GasFeesTipGroup
}

function toRecord(
  row: Selectable<GasFeesTipPayersDaily>,
): GasFeesTipPayersDailyRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    ethUsd: row.ethUsd,
    fastTipGwei: row.fastTipGwei,
    low: {
      txCount: row.lowTxCount,
      tipEth: row.lowTipEth,
      tipUsd: row.lowTipUsd,
    },
    middle: {
      txCount: row.middleTxCount,
      tipEth: row.middleTipEth,
      tipUsd: row.middleTipUsd,
    },
    high: {
      txCount: row.highTxCount,
      tipEth: row.highTipEth,
      tipUsd: row.highTipUsd,
    },
    roundTipTxCount: row.roundTipTxCount,
    atFastTipEth: row.atFastTipEth,
    atFastTipUsd: row.atFastTipUsd,
    nonOrdinary: {
      txCount: row.nonOrdinaryTxCount,
      tipEth: row.nonOrdinaryTipEth,
      tipUsd: row.nonOrdinaryTipUsd,
    },
  }
}

function toRow(
  record: GasFeesTipPayersDailyRecord,
): Insertable<GasFeesTipPayersDaily> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    ethUsd: record.ethUsd,
    fastTipGwei: record.fastTipGwei,
    lowTxCount: record.low.txCount,
    lowTipEth: record.low.tipEth,
    lowTipUsd: record.low.tipUsd,
    middleTxCount: record.middle.txCount,
    middleTipEth: record.middle.tipEth,
    middleTipUsd: record.middle.tipUsd,
    highTxCount: record.high.txCount,
    highTipEth: record.high.tipEth,
    highTipUsd: record.high.tipUsd,
    roundTipTxCount: record.roundTipTxCount,
    atFastTipEth: record.atFastTipEth,
    atFastTipUsd: record.atFastTipUsd,
    nonOrdinaryTxCount: record.nonOrdinary.txCount,
    nonOrdinaryTipEth: record.nonOrdinary.tipEth,
    nonOrdinaryTipUsd: record.nonOrdinary.tipUsd,
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
