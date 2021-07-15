import { BridgeDescription, Project, ProjectDetails } from '@l2beat/config'
import { L2Data } from '../../L2Data'
import { PageMetadata } from '../../PageMetadata'
import { formatUSD, getFromEnd, getPercentageChange } from '../../utils'

export interface ProjectPageProps {
  titleLength: 'long' | 'very-long' | undefined
  name: string
  tvl: string
  sevenDayChange: string
  icon: string
  apiEndpoint: string
  tokens: { symbol: string; endpoint: string }[]
  details: ProjectDetails
  bridges: BridgeDescription[]
  metadata: PageMetadata
}

export function getProjectPageProps(
  project: Project,
  l2Data: L2Data
): ProjectPageProps {
  const aggregate = l2Data.byProject[project.name].aggregate
  const tvl = getFromEnd(aggregate.data, 0)[1]
  const tvlSevenDaysAgo = getFromEnd(aggregate.data, 7)[1]
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  return {
    titleLength: getTitleLength(project.name),
    name: project.name,
    tvl: formatUSD(tvl),
    sevenDayChange,
    icon: `/icons/${project.slug}.png`,
    apiEndpoint: `/api/${project.slug}.json`,
    tokens: getTokens(project),
    details: project.details,
    bridges: project.bridges,
    metadata: {
      title: `${project.name} – L2BEAT`,
      description: `${project.name} project on L2BEAT. Layer 2 scaling analytics and research.`,
      image: `/meta-images/${project.slug}.png`,
      url: `https://l2beat.com/projects/${project.slug}/`,
    },
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
