import type { GasFeesDailyRecord } from '@l2beat/database'
import type { DuneQueryService } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { GasFeesChain } from './chains'
import { getBlocksQuery, getFeesQuery } from './getFeesQueries'

export type FeesDune = Pick<DuneQueryService, 'query'>

const FeesRow = v.object({
  blockchain: v.string(),
  day: v.string(),
  tx_count: v.number(),
  total_fee: v.number(),
  total_fee_usd: v.union([v.number(), v.null()]),
  l1_fee: v.number(),
  blob_fee: v.number(),
  median_fee_usd: v.union([v.number(), v.null()]),
})
export type FeesRow = v.infer<typeof FeesRow>

const BlocksRow = v.object({
  blockchain: v.string(),
  day: v.string(),
  base_fee: v.union([v.number(), v.null()]),
  gas_used: v.number(),
})
export type BlocksRow = v.infer<typeof BlocksRow>

export interface FeesDay {
  day: UnixTime
  /** The chains Dune has the whole day of */
  records: GasFeesDailyRecord[]
  /** Chains required on the day that Dune doesn't have the whole day of yet */
  missing: string[]
}

/**
 * Reads the days from `fromDay` to `toDay`, both included, in two Dune queries.
 * They read one day more: a chain's day is whole only once Dune has a later day
 * of it, as Dune loads some chains a day late and a day half loaded looks like a quiet one.
 */
export async function readFeesDays(
  dune: FeesDune,
  chains: GasFeesChain[],
  fromDay: UnixTime,
  toDay: UnixTime,
): Promise<FeesDay[]> {
  const readTo = UnixTime(toDay + UnixTime.DAY)
  const [fees, blocks] = await Promise.all([
    dune.query(
      getFeesQuery(chains, fromDay, readTo),
      'medium',
      v.array(FeesRow),
    ),
    dune.query(
      getBlocksQuery(chains, fromDay, readTo),
      'medium',
      v.array(BlocksRow),
    ),
  ])
  return joinFeesDays(chains, fromDay, toDay, fees, blocks)
}

/** Joins the two queries' rows per chain and day, oldest day first */
export function joinFeesDays(
  chains: GasFeesChain[],
  fromDay: UnixTime,
  toDay: UnixTime,
  fees: FeesRow[],
  blocks: BlocksRow[],
): FeesDay[] {
  const feesByKey = new Map(fees.map((r) => [`${r.blockchain}:${r.day}`, r]))
  const blocksByKey = new Map(
    blocks.map((r) => [`${r.blockchain}:${r.day}`, r]),
  )
  const lastFeesDay = getLastDays(fees)
  const lastBlocksDay = getLastDays(blocks)
  const days: FeesDay[] = []
  for (let day = fromDay; day <= toDay; day += UnixTime.DAY) {
    const result: FeesDay = { day, records: [], missing: [] }
    const date = UnixTime.toYYYYMMDD(day)
    for (const chain of chains) {
      const fee = feesByKey.get(`${chain.dune}:${date}`)
      const block = blocksByKey.get(`${chain.dune}:${date}`)
      const whole =
        (lastFeesDay.get(chain.dune) ?? '') > date &&
        (lastBlocksDay.get(chain.dune) ?? '') > date
      if (fee && block && whole) {
        result.records.push({
          timestamp: day,
          chain: chain.id,
          txCount: fee.tx_count,
          totalFeeNative: fee.total_fee,
          totalFeeUsd: fee.total_fee_usd,
          l1FeeNative: fee.l1_fee,
          blobFeeNative: fee.blob_fee,
          baseFeeNative: block.base_fee,
          gasUsed: block.gas_used,
          medianFeeUsd: fee.median_fee_usd,
        })
      } else if (day >= chain.requiredFrom) {
        result.missing.push(chain.id)
      }
    }
    days.push(result)
  }
  return days
}

/** The last day each chain has rows of, as YYYY-MM-DD, which sorts as dates do */
function getLastDays(rows: { blockchain: string; day: string }[]) {
  const last = new Map<string, string>()
  for (const row of rows) {
    if (row.day > (last.get(row.blockchain) ?? '')) {
      last.set(row.blockchain, row.day)
    }
  }
  return last
}
