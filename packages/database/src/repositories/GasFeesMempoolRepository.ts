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
