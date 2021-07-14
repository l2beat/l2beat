import { Project } from '@l2beat/config'
import { L2Data, ProjectData } from '../../L2Data'
import {
  formatPercent,
  formatUSD,
  getFromEnd,
  getPercentageChange,
} from '../../utils'

export interface HomePageProps {
  title: string
  tvl: string
  sevenDayChange: string
  apiEndpoint: string
  financialView: FinancialEntry[]
}

export interface FinancialEntry {
  name: string
  slug: string
  tvl: string
  oneDayChange: string
  sevenDayChange: string
  marketShare: string
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
    title: 'L2BEAT – The state of the layer two ecosystem',
    tvl: formatUSD(tvl),
    sevenDayChange,
    apiEndpoint: '/api/tvl.json',
    financialView,
  }
}

function getFinancialViewEntry(
  project: Project,
  projectData: ProjectData,
  aggregateTvl: number
) {
  const tvl = getFromEnd(projectData.aggregate.data, 0)[1]
  const tvlOneDayAgo = getFromEnd(projectData.aggregate.data, 1)[1]
  const oneDayChange = getPercentageChange(tvl, tvlOneDayAgo)
  const tvlSevenDaysAgo = getFromEnd(projectData.aggregate.data, 7)[1]
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)
  const marketShare = formatPercent(tvl / aggregateTvl)
  return {
    name: project.name,
    slug: project.slug,
    tvl: formatUSD(tvl),
    oneDayChange,
    sevenDayChange,
    marketShare,
  }
}
