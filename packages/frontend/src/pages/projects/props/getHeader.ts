import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { HeaderProps } from '../../../components'
import {
  formatUSD,
  getFromEnd,
  getPercentageChange,
} from '../../../utils/utils'

export function getHeader(project: Project, apiMain: ApiMain): HeaderProps {
  const hourly =
    apiMain.projects[project.id.toString()]?.charts.hourly.data ?? []
  const tvl = getFromEnd(hourly, 0)?.[1] ?? 0
  const tvlSevenDaysAgo = hourly[0]?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  return {
    icon: `/icons/${project.slug}.png`,
    title: project.name,
    titleLength: getTitleLength(project.name),
    tvl: formatUSD(tvl),
    sevenDayChange,
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
