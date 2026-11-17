import type {
  GasFeesTierWaitRecord,
  GasFeesTipLevelWaitRecord,
} from '@l2beat/database'
import type { DuneQueryService } from '@l2beat/shared'
import { v } from '@l2beat/validate'
import { GAS_FEES_TIERS } from '../tips/estimateTips'
import { TIP_LEVELS, toWaitBucket } from './buckets'
import {
  getMempoolDayQuery,
  type MempoolDayQueryInput,
} from './getMempoolDayQuery'

export type MempoolDune = Pick<DuneQueryService, 'query'>

const MempoolRow = v.object({
  grouping_set: v.number(),
  tip_from_wei: v.union([v.number(), v.null()]),
  bucket: v.union([v.number(), v.null()]),
  landed: v.number(),
  kept: v.number(),
  next_block: v.number(),
  tip_sum_gwei: v.number(),
  slow: v.number(),
  slow_next_block: v.number(),
  slow_within_2_blocks: v.number(),
  slow_within_5_blocks: v.number(),
  medium: v.number(),
  medium_next_block: v.number(),
  medium_within_2_blocks: v.number(),
  medium_within_5_blocks: v.number(),
  fast: v.number(),
  fast_next_block: v.number(),
  fast_within_2_blocks: v.number(),
  fast_within_5_blocks: v.number(),
})
export type MempoolRow = v.infer<typeof MempoolRow>

export interface MempoolDay {
  /** Mempool transactions that landed in the day's blocks */
  landedCount: number
  keptCount: number
  tipLevelWaits: GasFeesTipLevelWaitRecord[]
  tierWaits: GasFeesTierWaitRecord[]
}

/** grouping() of (tip_from_wei, bucket): a bit is set for each column left out */
const BY_LEVEL_AND_BUCKET = 0
const BY_BUCKET = 2
const TOTAL = 3

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
  const total = rows.filter((row) => row.grouping_set === TOTAL)
  if (total.length !== 1 || !total[0]) {
    throw new Error('Mempool day malformed', { cause: { timestamp } })
  }
  const levels = new Map(TIP_LEVELS.map((level) => [level.fromWei, level]))
  const tipLevelWaits: GasFeesTipLevelWaitRecord[] = []
  const tierWaits: GasFeesTierWaitRecord[] = []
  for (const row of rows) {
    if (row.grouping_set === BY_LEVEL_AND_BUCKET) {
      const level = levels.get(row.tip_from_wei ?? Number.NaN)
      if (!level || row.bucket === null) {
        throw new Error('Mempool row malformed', { cause: { timestamp, row } })
      }
      tipLevelWaits.push({
        timestamp,
        tipFromWei: level.fromWei,
        tipToWei: level.toWei,
        ...toWaitBucket(row.bucket),
        txCount: row.kept,
        nextBlockCount: row.next_block,
        tipSumGwei: row.tip_sum_gwei,
      })
    } else if (row.grouping_set === BY_BUCKET) {
      if (row.bucket === null) {
        throw new Error('Mempool row malformed', { cause: { timestamp, row } })
      }
      const bucket = toWaitBucket(row.bucket)
      for (const tier of GAS_FEES_TIERS) {
        if (row[tier] === 0) continue
        tierWaits.push({
          timestamp,
          tier,
          ...bucket,
          txCount: row[tier],
          nextBlockCount: row[`${tier}_next_block`],
          within2BlocksCount: row[`${tier}_within_2_blocks`],
          within5BlocksCount: row[`${tier}_within_5_blocks`],
        })
      }
    }
  }
  return {
    landedCount: total[0].landed,
    keptCount: total[0].kept,
    tipLevelWaits,
    tierWaits,
  }
}
