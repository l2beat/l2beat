import { UnixTime } from '@l2beat/shared-pure'
import type { Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type {
  GasFeesMempoolDay,
  GasFeesTierWait,
  GasFeesTipLevelWait,
} from '../kysely/generated/types'
import type { GasFeesTier } from './GasFeesTipHourlyRepository'

/**
 * complete: Dune has at least 99% of the landed transactions in Flashbots'
 * daily summary. partial: fewer, or no summary to check against. missing: Dune
 * has none, and the day has no waits.
 */
export type GasFeesMempoolDayStatus = 'complete' | 'partial' | 'missing'

export interface GasFeesMempoolDayRecord {
  /** Start of the day. */
  timestamp: UnixTime
  status: GasFeesMempoolDayStatus
  duneLandedCount: number
  /** null when Flashbots has no summary of the day. */
  flashbotsLandedCount: number | null
  keptCount: number
}

/** A wait bucket: milliseconds from first seen to the timestamp of the block landed in. */
export interface GasFeesWaitBucket {
  waitFromMs: number
  /** null for the last, open-ended bucket. */
  waitToMs: number | null
}

export interface GasFeesTipLevelWaitRecord extends GasFeesWaitBucket {
  timestamp: UnixTime
  tipFromWei: number
  tipToWei: number
  txCount: number
  nextBlockCount: number
  tipSumGwei: number
}

export interface GasFeesTierWaitRecord extends GasFeesWaitBucket {
  timestamp: UnixTime
  tier: GasFeesTier
  txCount: number
  nextBlockCount: number
  within2BlocksCount: number
  within5BlocksCount: number
}

/** A tip level's wait bucket, summed over days */
export interface GasFeesTipLevelWaitTotal extends GasFeesWaitBucket {
  tipFromWei: number
  tipToWei: number
  txCount: number
  tipSumGwei: number
}

/** A tier's wait bucket, summed over days */
export interface GasFeesTierWaitTotal extends GasFeesWaitBucket {
  tier: GasFeesTier
  txCount: number
}

export interface GasFeesMempoolDayData {
  day: GasFeesMempoolDayRecord
  tipLevelWaits: GasFeesTipLevelWaitRecord[]
  tierWaits: GasFeesTierWaitRecord[]
}

const TABLES = [
  'GasFeesMempoolDay',
  'GasFeesTipLevelWait',
  'GasFeesTierWait',
] as const

/** A day's mempool status and waits, written together. */
export class GasFeesMempoolRepository extends BaseRepository {
  /** Replaces everything stored for the day. */
  async replaceDay(data: GasFeesMempoolDayData): Promise<void> {
    const timestamp = UnixTime.toDate(data.day.timestamp)
    await this.transaction(async () => {
      for (const table of TABLES) {
        await this.db
          .deleteFrom(table)
          .where('timestamp', '=', timestamp)
          .execute()
      }
      await this.db
        .insertInto('GasFeesMempoolDay')
        .values({ ...data.day, timestamp })
        .execute()
      await this.batch(data.tipLevelWaits, 5_000, async (batch) => {
        await this.db
          .insertInto('GasFeesTipLevelWait')
          .values(
            batch.map((r) => ({
              ...r,
              timestamp,
              tipFromWei: String(r.tipFromWei),
              tipToWei: String(r.tipToWei),
            })),
          )
          .execute()
      })
      await this.batch(data.tierWaits, 5_000, async (batch) => {
        await this.db
          .insertInto('GasFeesTierWait')
          .values(batch.map((r) => ({ ...r, timestamp })))
          .execute()
      })
    })
  }

  /** Oldest first. */
  async getDays(
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<GasFeesMempoolDayRecord[]> {
    const rows = await this.db
      .selectFrom('GasFeesMempoolDay')
      .selectAll()
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toDayRecord)
  }

  async getTipLevelWaits(
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<GasFeesTipLevelWaitRecord[]> {
    const rows = await this.db
      .selectFrom('GasFeesTipLevelWait')
      .selectAll()
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')
      .orderBy('tipFromWei', 'asc')
      .orderBy('waitFromMs', 'asc')
      .execute()
    return rows.map(toTipLevelWaitRecord)
  }

  async getTierWaits(
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<GasFeesTierWaitRecord[]> {
    const rows = await this.db
      .selectFrom('GasFeesTierWait')
      .selectAll()
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')
      .orderBy('tier', 'asc')
      .orderBy('waitFromMs', 'asc')
      .execute()
    return rows.map(toTierWaitRecord)
  }

  /**
   * The waits of the complete days, added up per tip level and wait bucket:
   * a year of days is a million rows, so they are summed here.
   */
  async getCompleteTipLevelWaitTotals(
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<GasFeesTipLevelWaitTotal[]> {
    const rows = await this.db
      .selectFrom('GasFeesTipLevelWait as wait')
      .innerJoin('GasFeesMempoolDay as day', 'day.timestamp', 'wait.timestamp')
      .where('day.status', '=', 'complete' satisfies GasFeesMempoolDayStatus)
      .where('wait.timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('wait.timestamp', '<=', UnixTime.toDate(toInclusive))
      .groupBy([
        'wait.tipFromWei',
        'wait.tipToWei',
        'wait.waitFromMs',
        'wait.waitToMs',
      ])
      .select((eb) => [
        'wait.tipFromWei',
        'wait.tipToWei',
        'wait.waitFromMs',
        'wait.waitToMs',
        eb.fn.sum('wait.txCount').as('txCount'),
        eb.fn.sum('wait.tipSumGwei').as('tipSumGwei'),
      ])
      .orderBy('wait.tipFromWei', 'asc')
      .orderBy('wait.waitFromMs', 'asc')
      .execute()
    return rows.map((row) => ({
      ...row,
      tipFromWei: Number(row.tipFromWei),
      tipToWei: Number(row.tipToWei),
      txCount: Number(row.txCount),
      tipSumGwei: Number(row.tipSumGwei),
    }))
  }

  /** The waits of the complete days, added up per tier and wait bucket. */
  async getCompleteTierWaitTotals(
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<GasFeesTierWaitTotal[]> {
    const rows = await this.db
      .selectFrom('GasFeesTierWait as wait')
      .innerJoin('GasFeesMempoolDay as day', 'day.timestamp', 'wait.timestamp')
      .where('day.status', '=', 'complete' satisfies GasFeesMempoolDayStatus)
      .where('wait.timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('wait.timestamp', '<=', UnixTime.toDate(toInclusive))
      .groupBy(['wait.tier', 'wait.waitFromMs', 'wait.waitToMs'])
      .select((eb) => [
        'wait.tier',
        'wait.waitFromMs',
        'wait.waitToMs',
        eb.fn.sum('wait.txCount').as('txCount'),
      ])
      .orderBy('wait.tier', 'asc')
      .orderBy('wait.waitFromMs', 'asc')
      .execute()
    return rows.map((row) => ({
      ...row,
      tier: row.tier as GasFeesTier,
      txCount: Number(row.txCount),
    }))
  }

  /** Removes the days after `from`, for an indexer invalidating its height. */
  async deleteAfter(from: UnixTime): Promise<void> {
    await this.transaction(async () => {
      for (const table of TABLES) {
        await this.db
          .deleteFrom(table)
          .where('timestamp', '>', UnixTime.toDate(from))
          .execute()
      }
    })
  }

  async deleteAll(): Promise<void> {
    for (const table of TABLES) {
      await this.db.deleteFrom(table).execute()
    }
  }
}

function toDayRecord(
  row: Selectable<GasFeesMempoolDay>,
): GasFeesMempoolDayRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    status: row.status as GasFeesMempoolDayStatus,
  }
}

function toTipLevelWaitRecord(
  row: Selectable<GasFeesTipLevelWait>,
): GasFeesTipLevelWaitRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    // 64-bit in the table for headroom; the bounds themselves are a few gwei
    tipFromWei: Number(row.tipFromWei),
    tipToWei: Number(row.tipToWei),
  }
}

function toTierWaitRecord(
  row: Selectable<GasFeesTierWait>,
): GasFeesTierWaitRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    tier: row.tier as GasFeesTier,
  }
}
