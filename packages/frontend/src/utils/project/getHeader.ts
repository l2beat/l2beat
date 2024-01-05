import { Bridge, Layer2, Layer3 } from '@l2beat/config'
import { ActivityApiResponse, TvlApiResponse } from '@l2beat/shared-pure'

import { HeaderProps } from '../../components'
import { getTpsDaily } from '../activity/getTpsDaily'
import { getTpsWeeklyChange } from '../activity/getTpsWeeklyChange'
import { formatUSD, getPercentageChange } from '../utils'

export function getHeader(
  project: Layer2 | Layer3 | Bridge,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse?: ActivityApiResponse,
): HeaderProps {
  const hourly =
    tvlApiResponse.projects[project.id.toString()]?.charts.hourly.data ?? []
  const tvl = hourly.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = hourly.at(0)?.[1] ?? 0
  const tvlWeeklyChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const activityData =
    activityApiResponse?.projects[project.id.toString()]?.daily.data
  const tpsDaily = getTpsDaily(activityData, 'project')
  const tpsWeeklyChange = getTpsWeeklyChange(activityData, 'project')

  return {
    icon: `/icons/${project.display.slug}.png`,
    title: project.display.name,
    tvl: formatUSD(tvl),
    tvlWeeklyChange,
    tpsDaily: tpsDaily?.toString() ?? '',
    tpsWeeklyChange,
  }
}
