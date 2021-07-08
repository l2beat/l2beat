import { Project } from '@l2beat/config'
import { L2Data, ProjectData } from '../../L2Data'
import millify from 'millify'

export interface HomePageProps {
  tvl: string
  sevenDayChange: string
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

export function getHomePageProps(projects: Project[], l2Data: L2Data) {
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

function getFromEnd<T>(array: T[], n: number) {
  if (n >= array.length) {
    return array[0]
  }
  return array[array.length - 1 - n]
}

function getPercentageChange(now: number, then: number) {
  return formatPercent(now / then - 1, true)
}

function formatPercent(value: number, addPlus = false) {
  const result = (value * 100).toFixed(2) + '%'
  if (addPlus && result[0] !== '-') {
    return '+' + result
  }
  return result
}

function formatUSD(value: number) {
  return `$${millify(value)}`
}
