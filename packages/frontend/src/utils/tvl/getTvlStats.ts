import { MainProject } from '@l2beat/types'

import { getPercentageChange } from '../utils'
import { getTvlBreakdown } from './getTVLBreakdown'

export type TvlStats = ReturnType<typeof getTvlStats>

export function getTvlStats(
  apiProject: MainProject,
  name: string,
  associatedTokens: string[],
) {
  const aggregate = apiProject.charts.hourly.data
  const tvl = aggregate.at(-1)?.[1] ?? 0
  const tvlOneDayAgo = aggregate.at(-25)?.[1] ?? 0
  // This assumes that hourly data spans exactly 7 days
  const tvlSevenDaysAgo = aggregate[0]?.[1] ?? 0

  return {
    tvl,
    tvlBreakdown: getTvlBreakdown(
      name,
      associatedTokens,
      tvl,
      apiProject.tokens,
    ),
    oneDayChange: getPercentageChange(tvl, tvlOneDayAgo),
    sevenDayChange: getPercentageChange(tvl, tvlSevenDaysAgo),
  }
}
