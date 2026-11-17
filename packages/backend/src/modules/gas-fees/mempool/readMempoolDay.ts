import type {
  GasFeesTierWaitRecord,
  GasFeesTipLevelWaitRecord,
  GasFeesWaitBucket,
} from '@l2beat/database'
import type { DuneQueryService } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { GAS_FEES_TIERS } from '../tips/estimateTips'
import { TIP_LEVELS, toWaitBucket } from './buckets'
import {
  getMempoolDayQuery,
  type MempoolDayQueryInput,
  TIER_COUNT_BLOCKS,
} from './getMempoolDayQuery'

export type MempoolDune = Pick<DuneQueryService, 'query'>

const MempoolRow = v.object({
  tip_from_wei: v.union([v.number(), v.null()]),
  bucket: v.union([v.number(), v.null()]),
  /** Only on the day's totals */
  landed: v.union([v.number(), v.null()]),
  kept: v.number(),
  next_block: v.number(),
  tip_sum_gwei: v.number(),
  /** Only on the rows per wait bucket: TIER_COUNT_BLOCKS for each of GAS_FEES_TIERS */
  tier_counts: v.union([v.array(v.number()), v.null()]),
})
export type MempoolRow = v.infer<typeof MempoolRow>

export interface MempoolDay {
  /** Mempool transactions that landed in the day's blocks */
  landedCount: number
  keptCount: number
  tipLevelWaits: GasFeesTipLevelWaitRecord[]
  tierWaits: GasFeesTierWaitRecord[]
}

export async function readMempoolDay(
  dune: MempoolDune,
  input: MempoolDayQueryInput,
): Promise<MempoolDay> {
  const rows = await dune.query(
    getMempoolDayQuery(input),
    'medium',
    v.array(MempoolRow),
  )
  return toMempoolDay(input.day, rows)
}

export function toMempoolDay(
  timestamp: MempoolDayQueryInput['day'],
  rows: MempoolRow[],
): MempoolDay {
  // With no rows at all, the grand total may be left out too
  if (rows.length === 0) {
    return { landedCount: 0, keptCount: 0, tipLevelWaits: [], tierWaits: [] }
  }
  const malformed = (row?: MempoolRow) =>
    new Error('Mempool row malformed', { cause: { timestamp, row } })
  const levels = new Map(TIP_LEVELS.map((level) => [level.fromWei, level]))
  const tipLevelWaits: GasFeesTipLevelWaitRecord[] = []
  const tierWaits: GasFeesTierWaitRecord[] = []
  const totals: { landedCount: number; keptCount: number }[] = []
  for (const row of rows) {
    if (row.tier_counts !== null) {
      if (row.bucket === null) throw malformed(row)
      tierWaits.push(
        ...toTierWaits(timestamp, toWaitBucket(row.bucket), row.tier_counts),
      )
    } else if (row.bucket === null) {
      if (row.tip_from_wei !== null || row.landed === null) throw malformed(row)
      totals.push({ landedCount: row.landed, keptCount: row.kept })
    } else {
      const level = levels.get(row.tip_from_wei ?? Number.NaN)
      if (!level) throw malformed(row)
      tipLevelWaits.push({
        timestamp,
        tipFromWei: level.fromWei,
        tipToWei: level.toWei,
        ...toWaitBucket(row.bucket),
        txCount: row.kept,
        nextBlockCount: row.next_block,
        tipSumGwei: row.tip_sum_gwei,
      })
    }
  }
  const total = totals[0]
  if (totals.length !== 1 || !total) {
    throw new Error('Mempool day malformed', { cause: { timestamp } })
  }
  return { ...total, tipLevelWaits, tierWaits }
}

/** The tiers with transactions in the wait bucket, from a row's tier_counts */
function toTierWaits(
  timestamp: UnixTime,
  bucket: GasFeesWaitBucket,
  counts: number[],
): GasFeesTierWaitRecord[] {
  const perTier = TIER_COUNT_BLOCKS.length
  const malformed = new Error('Mempool tier counts malformed', {
    cause: { timestamp, counts },
  })
  if (counts.length !== GAS_FEES_TIERS.length * perTier) throw malformed
  return GAS_FEES_TIERS.flatMap((tier, i) => {
    const [txCount, nextBlockCount, within2BlocksCount, within5BlocksCount] =
      counts.slice(i * perTier, (i + 1) * perTier)
    if (
      txCount === undefined ||
      nextBlockCount === undefined ||
      within2BlocksCount === undefined ||
      within5BlocksCount === undefined
    ) {
      throw malformed
    }
    if (txCount === 0) return []
    return [
      {
        timestamp,
        tier,
        ...bucket,
        txCount,
        nextBlockCount,
        within2BlocksCount,
        within5BlocksCount,
      },
    ]
  })
}
