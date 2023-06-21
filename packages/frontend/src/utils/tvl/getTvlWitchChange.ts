import { TvlApiCharts } from '@l2beat/shared-pure'

import { getPercentageChange } from '../utils'

export function getTvlWithChange(charts: TvlApiCharts | undefined) {
  const data = charts?.hourly.data ?? []
  const tvl = data.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = data[0]?.[1] ?? 0
  const tvlWeeklyChange = getPercentageChange(tvl, tvlSevenDaysAgo)
  return { tvl, tvlWeeklyChange }
}
