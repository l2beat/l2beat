import { Project } from '@l2beat/config'
import { ProjectData } from '../../../L2Data'
import {
  formatPercent,
  formatUSD,
  getFromEnd,
  getPercentageChange,
} from '../../../utils'
import { getTechnology } from './getTechnology'

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

export function getFinancialViewEntry(
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
function toWarning(name: string, share: number, token: string) {
  const percent = formatPercent(share)
  const what = `The ${token} token associated with ${name}`
  return `${what} accounts for ${percent} of the TVL!`
}
