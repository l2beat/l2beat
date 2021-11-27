import { getTokenBySymbol, Project } from '@l2beat/config'

import { ChartData, L2Data, ProjectData } from '../../../L2Data'
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

  const tvlBreakdown = getTVLBreakdown(
    tvl,
    projectData.byToken,
    project.associatedTokens ?? []
  )

  let tvlWarning =
    tvlBreakdown.associated > 0.1
      ? toWarning(
          project.name,
          tvlBreakdown.associated,
          project.associatedTokens ?? []
        )
      : undefined
  let warningSeverity: 'bad' | 'warning' | 'info' =
    tvlBreakdown.associated > 0.9 ? 'bad' : 'warning'
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
    tvlBreakdown: {
      ...tvlBreakdown,
      warning: tvlWarning,
      warningSeverity,
    },
    oneDayChange: getPercentageChange(tvl, tvlOneDayAgo),
    sevenDayChange: getPercentageChange(tvl, tvlSevenDaysAgo),
    marketShare: formatPercent(tvl / aggregateTvl),
    purpose: project.details.purpose,
    technology: getTechnology(project),
  }
}

function getTVLBreakdown(
  total: number,
  byToken: Record<string, ChartData>,
  associatedTokens: string[]
) {
  let associated = 0
  let ether = 0
  let stable = 0
  let other = 0
  for (const [token, data] of Object.entries(byToken)) {
    const tvl = getFromEnd(data.data, 0)[2]
    const category = getTokenBySymbol(token).category
    if (associatedTokens.includes(token)) {
      associated += tvl
    } else if (category === 'ether') {
      ether += tvl
    } else if (category === 'stablecoin') {
      stable += tvl
    } else if (category === 'other') {
      other += tvl
    }
  }

  const toPercent = (x: number) => ((x * 100) / total).toFixed(2) + '%'
  const toLabel = (text: string, x: number) =>
    x === 0 ? '' : `${text} – ${toPercent(x)}`

  const label = [
    toLabel(associatedTokens.join(' and '), associated),
    toLabel('Ether', ether),
    toLabel('Stablecoins', stable),
    toLabel('Other', other),
  ]
    .filter((x) => x !== '')
    .join('\n')

  return {
    label,
    associated: associated / total,
    ether: ether / total,
    stable: stable / total,
    other: other / total,
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
