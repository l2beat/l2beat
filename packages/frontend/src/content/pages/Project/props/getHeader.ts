import { Project } from '@l2beat/config'

import { HeaderProps } from '../../../common'
import { L2Data } from '../../../L2Data'
import { formatUSD, getFromEnd, getPercentageChange } from '../../../utils'

export function getHeader(project: Project, l2Data: L2Data): HeaderProps {
  const aggregate = l2Data.byProject[project.name]?.aggregate.data ?? []
  const tvl = getFromEnd(aggregate, 0)?.[1] ?? 0
  const tvlSevenDaysAgo = getFromEnd(aggregate, 7)?.[1] ?? 0
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
    case 'DeversiFi':
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
