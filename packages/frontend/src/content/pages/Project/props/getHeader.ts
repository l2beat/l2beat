import { Project } from '@l2beat/config'

import { HeaderProps } from '../../../common'
import { L2Data } from '../../../L2Data'
import { formatUSD, getFromEnd, getPercentageChange } from '../../../utils'

export function getHeader(project: Project, l2Data: L2Data): HeaderProps {
  const aggregate = l2Data.byProject[project.name].aggregate
  const tvl = getFromEnd(aggregate.data, 0)[1]
  const tvlSevenDaysAgo = getFromEnd(aggregate.data, 7)[1]
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
    case 'ImmutableX':
      return 'long'
    case 'OMG Network':
    case 'Layer2.Finance':
    case 'Nahmii 1.0':
    case 'ZKSwap V2':
    case 'Polygon Hermez':
      return 'very-long'
  }
}
