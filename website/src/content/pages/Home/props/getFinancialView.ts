import { Project } from '@l2beat/config'
import { L2Data, ProjectData } from '../../../L2Data'
import {
  formatPercent,
  formatUSD,
  getFromEnd,
  getPercentageChange,
} from '../../../utils'
import {
  FinancialViewEntry,
  FinancialViewProps,
} from '../view/FinancialView/FinancialView'
import { getTechnology } from './getTechnology'

export function getFinancialView(
  projects: Project[],
  l2Data: L2Data,
  tvl: number
): FinancialViewProps {
  return {
    items: projects.map((x) =>
      getFinancialViewEntry(x, l2Data.byProject[x.name], tvl)
    ),
  }
}

function getFinancialViewEntry(
  project: Project,
  projectData: ProjectData,
  aggregateTvl: number
): FinancialViewEntry {
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
    isStarkEx: project.details.provider === 'StarkEx',
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
function toWarning(name: string, share: number, token: string) {
  const percent = formatPercent(share)
  const what = `The ${token} token associated with ${name}`
  return `${what} accounts for ${percent} of the TVL!`
}
