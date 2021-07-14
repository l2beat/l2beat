import { Project } from '@l2beat/config'
import { L2Data } from '../../L2Data'
import { formatUSD, getFromEnd, getPercentageChange } from '../../utils'

export interface ProjectPageProps {
  title: string
  titleLength: 'long' | 'very-long' | undefined
  name: string
  tvl: string
  sevenDayChange: string
  icon: string
  apiEndpoint: string
  tokens: { symbol: string; endpoint: string }[]
}

export function getProjectPageProps(
  project: Project,
  l2Data: L2Data
): ProjectPageProps {
  const tvl = getFromEnd(l2Data.aggregate.data, 0)[1]
  const tvlSevenDaysAgo = getFromEnd(l2Data.aggregate.data, 7)[1]
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  return {
    title: `${project.name} – L2BEAT`,
    titleLength: getTitleLength(project.name),
    name: project.name,
    tvl: formatUSD(tvl),
    sevenDayChange,
    icon: `/icons/${project.slug}.png`,
    apiEndpoint: `/api/${project.slug}.json`,
    tokens: getTokens(project),
  }
}

function getTitleLength(name: string): ProjectPageProps['titleLength'] {
  switch (name) {
    case 'Optimism':
    case 'DeversiFi':
    case 'ImmutableX':
      return 'long'
    case 'OMG Network':
    case 'Layer2.Finance':
      return 'very-long'
  }
}

function getTokens(project: Project) {
  return project.bridges
    .flatMap((x) => x.tokens)
    .filter((x, i, a) => a.indexOf(x) === i)
    .sort()
    .map((x) => ({
      symbol: x,
      endpoint: `/api/${project.slug}/${x.toLowerCase()}.json`,
    }))
}
