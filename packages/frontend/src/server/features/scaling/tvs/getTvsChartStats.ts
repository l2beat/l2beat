import { v } from '@l2beat/validate'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { optionToRange } from '~/utils/range/range'
import { getRecategorisedTvsChart } from './getRecategorisedTvsChartData'
import { TvsProjectFilter } from './utils/projectFilterUtils'

export const TvsChartStatsParams = v.object({
  filter: TvsProjectFilter,
  excludeAssociatedTokens: v.boolean(),
  excludeRwaRestrictedTokens: v.boolean(),
})

export type TvsChartStatsParams = v.infer<typeof TvsChartStatsParams>

export type TvsChartStats = {
  total: TvsStat
  rollups: TvsStat
  validiumsAndOptimiums: TvsStat
  others: TvsStat
}

type TvsStat = {
  value: number
  change: number | undefined
  changePeriod: PercentageChangePeriod
}

export async function getTvsChartStats({
  filter,
  excludeAssociatedTokens,
  excludeRwaRestrictedTokens,
}: TvsChartStatsParams): Promise<TvsChartStats | null> {
  const { chart } = await getRecategorisedTvsChart({
    range: optionToRange('7d'),
    excludeAssociatedTokens,
    excludeRwaRestrictedTokens,
    filter,
  })

  const oldest = chart.at(0)
  const newest = chart.at(-1)
  if (!oldest || !newest) return null

  const oldestRollups = oldest[1] ?? 0
  const oldestValidiumsAndOptimiums = oldest[2] ?? 0
  const oldestOthers = oldest[3] ?? 0

  const newestRollups = newest[1] ?? 0
  const newestValidiumsAndOptimiums = newest[2] ?? 0
  const newestOthers = newest[3] ?? 0

  const stat = (now: number, then: number): TvsStat => ({
    value: now,
    change: calculatePercentageChange(now, then),
    changePeriod: '7D',
  })

  return {
    total: stat(
      newestRollups + newestValidiumsAndOptimiums + newestOthers,
      oldestRollups + oldestValidiumsAndOptimiums + oldestOthers,
    ),
    rollups: stat(newestRollups, oldestRollups),
    validiumsAndOptimiums: stat(
      newestValidiumsAndOptimiums,
      oldestValidiumsAndOptimiums,
    ),
    others: stat(newestOthers, oldestOthers),
  }
}
