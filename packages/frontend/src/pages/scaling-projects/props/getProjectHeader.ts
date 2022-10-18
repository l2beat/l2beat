import { Layer2 } from '@l2beat/config'
import { ActivityApiResponse, TvlApiResponse } from '@l2beat/types'

import { formatLargeNumber } from '../../../utils'
import { getTpsDaily } from '../../../utils/activity/getTpsDaily'
import { getTpsWeeklyChange } from '../../../utils/activity/getTpsWeeklyChange'
import { getTransactionMonthlyCount } from '../../../utils/activity/getTransactionWeeklyCount'
import { formatUSD, getPercentageChange } from '../../../utils/utils'
import { ProjectHeaderProps } from '../view/ProjectHeader'

export function getProjectHeader(
  project: Layer2,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse?: ActivityApiResponse,
): ProjectHeaderProps {
  const hourly =
    tvlApiResponse.projects[project.id.toString()]?.charts.hourly.data ?? []
  const tvl = hourly.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = hourly[0]?.[1] ?? 0
  const tvlWeeklyChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const activityData =
    activityApiResponse?.projects[project.id.toString()]?.data
  const tpsDaily = getTpsDaily(activityData)
  const tpsWeeklyChange = getTpsWeeklyChange(activityData)
  const transactionMonthlyCount = getTransactionMonthlyCount(activityData)

  return {
    icon: `/icons/${project.display.slug}.png`,
    title: project.display.name,
    titleLength: getTitleLength(project.display.name),
    tvl: formatUSD(tvl),
    tvlWeeklyChange,
    tpsDaily: tpsDaily?.toFixed(2) ?? '',
    tpsWeeklyChange,
    transactionMonthlyCount:
      transactionMonthlyCount !== undefined
        ? formatLargeNumber(transactionMonthlyCount)
        : undefined,
    purpose: project.display.purpose,
    technology: project.technology.category,
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
