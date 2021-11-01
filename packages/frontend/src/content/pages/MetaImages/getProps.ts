import { Project } from '@l2beat/config'

import { L2Data } from '../../L2Data'
import { PageMetadata } from '../../PageMetadata'
import { formatUSD, getFromEnd, getPercentageChange } from '../../utils'

export interface MetaImageProps {
  tvl: string
  sevenDayChange: string
  name?: string
  icon?: string
  apiEndpoint: string
  metadata: PageMetadata
}

export function getProps(l2Data: L2Data, project?: Project): MetaImageProps {
  const { aggregate } = project ? l2Data.byProject[project.name] : l2Data
  const tvl = getFromEnd(aggregate.data, 0)[1]
  const tvlSevenDaysAgo = getFromEnd(aggregate.data, 7)[1]
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  return {
    tvl: formatUSD(tvl),
    sevenDayChange,
    name: project?.name,
    icon: project && `/icons/${project.slug}.png`,
    apiEndpoint: `/api/${project?.slug ?? 'tvl'}.json`,
    metadata: {
      title: 'Meta Image',
      description: '-',
      image: '-',
      url: '-',
    },
  }
}
