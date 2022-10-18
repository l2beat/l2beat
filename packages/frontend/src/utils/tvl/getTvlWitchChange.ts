import { Bridge, Layer2 } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/types'

import { getPercentageChange } from '../utils'

export function getTvlWithChange(
  tvlApiResponse: TvlApiResponse,
  project: Bridge | Layer2,
) {
  const hourly =
    tvlApiResponse.projects[project.id.toString()]?.charts.hourly.data ?? []
  const tvl = hourly.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = hourly[0]?.[1] ?? 0
  const tvlWeeklyChange = getPercentageChange(tvl, tvlSevenDaysAgo)
  return { tvl, tvlWeeklyChange }
}
