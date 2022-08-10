import { ApiMain, Project as ApiProject, Token } from '@l2beat/common'
import { getTokenByAssetId, Project } from '@l2beat/config'

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
  apiMain: ApiMain,
  tvl: number,
): FinancialViewProps {
  return {
    items: projects.map((x) =>
      getFinancialViewEntry(x, apiMain.projects[x.name], tvl),
    ),
  }
}

function getFinancialViewEntry(
  project: Project,
  projectData: ApiProject | undefined,
  aggregateTvl: number,
): FinancialViewEntry {
  const aggregate = projectData?.charts.hourly.data ?? []
  const tvl = getFromEnd(aggregate, 0)?.[1] ?? 0
  const tvlOneDayAgo = getFromEnd(aggregate, 24)?.[1] ?? 0
  const tvlSevenDaysAgo = aggregate[0]?.[1] ?? 0

  const tvlBreakdown = getTVLBreakdown(
    tvl,
    projectData?.tokens ?? [],
    project.associatedTokens ?? [],
  )

  let tvlWarning =
    tvlBreakdown.associated > 0.1
      ? toWarning(
          project.name,
          tvlBreakdown.associated,
          project.associatedTokens ?? [],
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
  tokens: Token[],
  associatedTokens: string[],
) {
  if (total === 0) {
    return {
      empty: true,
      label: 'No tokens',
      associated: 0,
      ether: 0,
      stable: 0,
      other: 0,
    }
  }
  let associated = 0
  let ether = 0
  let stable = 0
  let other = 0
  for (const { assetId, tvl } of tokens) {
    const { category, symbol } = getTokenByAssetId(assetId)
    if (associatedTokens.includes(symbol)) {
      associated += tvl
    } else if (category === 'ether') {
      ether += tvl
    } else if (category === 'stablecoin') {
      stable += tvl
    } else {
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
    empty: false,
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
