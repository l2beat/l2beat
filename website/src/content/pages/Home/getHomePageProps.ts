import { Project } from '@l2beat/config'
import { L2Data, ProjectData } from '../../L2Data'
import { PageMetadata } from '../../PageMetadata'
import {
  formatPercent,
  formatUSD,
  getFromEnd,
  getPercentageChange,
} from '../../utils'

export interface HomePageProps {
  tvl: string
  sevenDayChange: string
  apiEndpoint: string
  financialView: FinancialEntry[]
  metadata: PageMetadata
}

export interface FinancialEntry {
  name: string
  slug: string
  tvl: string
  tvlWarning?: string
  severeWarning: boolean
  oneDayChange: string
  sevenDayChange: string
  marketShare: string
  purpose: string
  technology: {
    abbreviation: string
    name: string
  }
}

export function getHomePageProps(
  projects: Project[],
  l2Data: L2Data
): HomePageProps {
  const tvl = getFromEnd(l2Data.aggregate.data, 0)[1]
  const tvlSevenDaysAgo = getFromEnd(l2Data.aggregate.data, 7)[1]
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const getTvl = (project: Project) =>
    getFromEnd(l2Data.byProject[project.name].aggregate.data, 0)[1]
  const ordering = [...projects].sort((a, b) => getTvl(b) - getTvl(a))

  const financialView = ordering.map((x) =>
    getFinancialViewEntry(x, l2Data.byProject[x.name], tvl)
  )

  return {
    tvl: formatUSD(tvl),
    sevenDayChange,
    apiEndpoint: '/api/tvl.json',
    financialView,
    metadata: {
      title: 'L2BEAT – The state of the layer two ecosystem',
      description:
        'L2BEAT is a analytics and research website about Ethereum layer 2 scaling.',
      image: 'https://l2beat.com/meta-images/overview.png',
      url: 'https://l2beat.com/',
    },
  }
}

function getFinancialViewEntry(
  project: Project,
  projectData: ProjectData,
  aggregateTvl: number
) {
  const tvl = getFromEnd(projectData.aggregate.data, 0)[1]
  const tvlOneDayAgo = getFromEnd(projectData.aggregate.data, 1)[1]
  const tvlSevenDaysAgo = getFromEnd(projectData.aggregate.data, 7)[1]

  const token = project.associatedToken
  const tokenTvl = token
    ? getFromEnd(projectData.byToken[token].data, 0)[2]
    : undefined

  const tokenShare = tokenTvl ? tokenTvl / tvl : 0
  const tvlWarning =
    token && tokenShare > 0.1
      ? toWarning(project.name, tokenShare, token)
      : undefined

  return {
    name: project.name,
    slug: project.slug,
    tvl: formatUSD(tvl),
    tvlWarning: tvlWarning,
    severeWarning: tokenShare > 0.9,
    oneDayChange: getPercentageChange(tvl, tvlOneDayAgo),
    sevenDayChange: getPercentageChange(tvl, tvlSevenDaysAgo),
    marketShare: formatPercent(tvl / aggregateTvl),
    purpose: project.details.purpose,
    technology: getTechnology(project),
  }
}

function getTechnology(project: Project) {
  const name = project.details.technologyName
  switch (name) {
    case 'Optimistic Rollup':
      return { abbreviation: 'ORU', name }
    case 'ZK Rollup':
      return { abbreviation: 'ZKR', name }
    case 'Plasma':
      return { abbreviation: 'PLA', name }
    case 'Validium':
      return { abbreviation: 'VAL', name }
    case 'State Pools':
      return { abbreviation: 'STP', name }
  }
  return { abbreviation: '???', name }
}

function toWarning(name: string, share: number, token: string) {
  const percent = formatPercent(share)
  const what = `The ${token} token associated with ${name}`
  return `${what} accounts for ${percent} of the TVL!`
}
