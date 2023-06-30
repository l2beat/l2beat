import { Bridge, Layer2 } from '@l2beat/config'
import { ActivityApiResponse, TvlApiResponse } from '@l2beat/shared-pure'

import { HeaderProps } from '../../components'
import { getTpsDaily } from '../activity/getTpsDaily'
import { getTpsWeeklyChange } from '../activity/getTpsWeeklyChange'
import { formatUSD, getPercentageChange } from '../utils'

export function getHeader(
  project: Layer2 | Bridge,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse?: ActivityApiResponse,
): HeaderProps {
  const hourly =
    tvlApiResponse.projects[project.id.toString()]?.charts.hourly.data ?? []
  const tvl = hourly.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = hourly[0]?.[1] ?? 0
  const tvlWeeklyChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const activityData =
    activityApiResponse?.projects[project.id.toString()]?.data
  const tpsDaily = getTpsDaily(activityData)
  const tpsWeeklyChange = getTpsWeeklyChange(activityData)

  return {
    icon: `/icons/${project.display.slug}.png`,
    title: project.display.name,
    titleLength: getTitleLength(project.display.name),
    tvl: formatUSD(tvl),
    tvlWeeklyChange,
    tpsDaily: tpsDaily?.toString() ?? '',
    tpsWeeklyChange,
  }
}

function getTitleLength(name: string): 'long' | 'very-long' | undefined {
  switch (name) {
    case 'Optimism':
    case 'rhino.fi':
    case 'Immutable X':
      return 'long'
    case 'OMG Network':
    case 'Layer2.Finance':
    case 'ZKSwap V2':
    case 'Polygon Hermez':
    case 'Metis Andromeda':
      return 'very-long'
  }
}
