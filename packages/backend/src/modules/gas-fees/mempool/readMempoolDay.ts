import type {
  GasFeesTierWaitRecord,
  GasFeesTipLevelWaitRecord,
} from '@l2beat/database'
import type { DuneQueryService } from '@l2beat/shared'
import { GAS_FEES_TIERS, type UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { TIP_LEVELS, toWaitBucket } from './buckets'
import {
  getMempoolDayQuery,
  type MempoolDayQueryInput,
  ROW_KIND,
  TIER_COUNTS,
} from './getMempoolDayQuery'

export type MempoolDune = Pick<DuneQueryService, 'query'>

const MempoolRow = v.object({
  /** One of ROW_KIND */
  kind: v.number(),
  tip_from_wei: v.union([v.number(), v.null()]),
  bucket: v.union([v.number(), v.null()]),
  /** Only on the day's totals */
  landed: v.union([v.number(), v.null()]),
  kept: v.number(),
  next_block: v.number(),
  tip_sum_gwei: v.number(),
  /** Only on the rows per wait bucket: TIER_COUNTS for each of GAS_FEES_TIERS */
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
  timestamp: UnixTime,
  rows: MempoolRow[],
): MempoolDay {
  // With no rows at all, the grand total may be left out too
  if (rows.length === 0) {
    return { landedCount: 0, keptCount: 0, tipLevelWaits: [], tierWaits: [] }
  }
  const malformed = (row: MempoolRow) =>
    new Error('Mempool row malformed', { cause: { timestamp, row } })
  const levels = new Map(TIP_LEVELS.map((level) => [level.fromWei, level]))
  const tipLevelWaits: GasFeesTipLevelWaitRecord[] = []
  const tierWaits: GasFeesTierWaitRecord[] = []
  const totals: { landedCount: number; keptCount: number }[] = []
  for (const row of rows) {
    if (row.kind === ROW_KIND.level) {
      const level = levels.get(row.tip_from_wei ?? Number.NaN)
      if (!level || row.bucket === null) throw malformed(row)
      tipLevelWaits.push({
        timestamp,
        tipFromWei: level.fromWei,
        tipToWei: level.toWei,
        ...toWaitBucket(row.bucket),
        txCount: row.kept,
        nextBlockCount: row.next_block,
        tipSumGwei: row.tip_sum_gwei,
      })
    } else if (row.kind === ROW_KIND.tier) {
      if (row.bucket === null || row.tier_counts === null) throw malformed(row)
      const bucket = toWaitBucket(row.bucket)
      const counts = row.tier_counts
      if (counts.length !== GAS_FEES_TIERS.length * TIER_COUNTS.length) {
        throw malformed(row)
      }
      for (const [i, tier] of GAS_FEES_TIERS.entries()) {
        const count = (field: (typeof TIER_COUNTS)[number]['field']) => {
          const at = TIER_COUNTS.findIndex((c) => c.field === field)
          const value = counts[i * TIER_COUNTS.length + at]
          if (value === undefined) throw malformed(row)
          return value
        }
        if (count('txCount') === 0) continue
        tierWaits.push({
          timestamp,
          tier,
          ...bucket,
          txCount: count('txCount'),
          nextBlockCount: count('nextBlockCount'),
          within2BlocksCount: count('within2BlocksCount'),
          within5BlocksCount: count('within5BlocksCount'),
        })
      }
    } else if (row.kind === ROW_KIND.total) {
      if (row.landed === null) throw malformed(row)
      totals.push({ landedCount: row.landed, keptCount: row.kept })
    } else {
      throw malformed(row)
    }
  }
  const total = totals[0]
  if (totals.length !== 1 || !total) {
    throw new Error('Mempool day malformed', { cause: { timestamp } })
  }
  return { ...total, tipLevelWaits, tierWaits }
}
