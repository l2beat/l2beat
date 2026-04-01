import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { optionToRange } from '~/utils/range/range'
import { getRecategorisedTvsChart } from './getRecategorisedTvsChartData'
import type { TvsProjectFilter } from './utils/projectFilterUtils'

export type TvsChartStats = {
  total: TvsStat
  rollups: TvsStat
  validiumsAndOptimiums: TvsStat
  others: TvsStat
}

type TvsStat = {
  value: number
  change: number | undefined
}

export async function getTvsChartStats(
  filter: TvsProjectFilter,
): Promise<TvsChartStats | undefined> {
  const { chart } = await getRecategorisedTvsChart({
    range: optionToRange('7d'),
    filter,
  })

  const oldest = chart.at(0)
  const newest = chart.at(-1)
  if (!oldest || !newest) return undefined

  const oldestRollups = oldest[1] ?? 0
  const oldestValidiumsAndOptimiums = oldest[2] ?? 0
  const oldestOthers = oldest[3] ?? 0

  const newestRollups = newest[1] ?? 0
  const newestValidiumsAndOptimiums = newest[2] ?? 0
  const newestOthers = newest[3] ?? 0

  const stat = (now: number, then: number): TvsStat => ({
    value: now,
    change: calculatePercentageChange(now, then),
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
