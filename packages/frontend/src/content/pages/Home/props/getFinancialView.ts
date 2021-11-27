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

  const tokens = project.associatedTokens
  const tokenTvl = tokens
    ?.map((token) => getFromEnd(projectData.byToken[token].data, 0)[2])
    .reduce((a, b) => a + b, 0)

  const tokenShare = tokenTvl ? tokenTvl / tvl : 0
  let tvlWarning =
    tokens && tokenShare > 0.1
      ? toWarning(project.name, tokenShare, tokens)
      : undefined
  let warningSeverity: 'bad' | 'warning' | 'info' =
    tokenShare > 0.9 ? 'bad' : 'warning'
  if (project.name === 'Layer2.Finance') {
    tvlWarning =
      'The TVL is calculated incorrectly because it does not account for the assets locked in DeFi.'
    warningSeverity = 'info'
  }

  return {
    name: project.name,
    slug: project.slug,
    provider: project.details.provider,
    tvl: formatUSD(tvl),
    tvlWarning: tvlWarning,
    warningSeverity,
    oneDayChange: getPercentageChange(tvl, tvlOneDayAgo),
    sevenDayChange: getPercentageChange(tvl, tvlSevenDaysAgo),
    marketShare: formatPercent(tvl / aggregateTvl),
    purpose: project.details.purpose,
    technology: getTechnology(project),
  }
}

function toWarning(name: string, share: number, tokens: string[]) {
  const percent = formatPercent(share)
  if (tokens.length === 1) {
    const what = `The ${tokens[0]} token associated with ${name}`
    return `${what} accounts for ${percent} of the TVL!`
  } else {
    const what = `The ${tokens.join(' and ')} tokens associated with ${name}`
    return `${what} account for ${percent} of the TVL!`
  }
}
