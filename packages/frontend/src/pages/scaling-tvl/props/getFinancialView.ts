import { Layer2, safeGetTokenByAssetId } from '@l2beat/config'
import { ApiMain, Project as ApiProject, Token } from '@l2beat/types'

import {
  formatPercent,
  formatUSD,
  getPercentageChange,
} from '../../../utils/utils'
import { FinancialViewEntry, FinancialViewProps } from '../view/FinancialView'
import { getTechnology } from './getTechnology'

export function getFinancialView(
  projects: Layer2[],
  apiMain: ApiMain,
  tvl: number,
): FinancialViewProps {
  return {
    items: projects.map((x) =>
      getFinancialViewEntry(x, apiMain.projects[x.id.toString()], tvl),
    ),
  }
}

function getFinancialViewEntry(
  project: Layer2,
  projectData: ApiProject | undefined,
  aggregateTvl: number,
): FinancialViewEntry {
  const aggregate = projectData?.charts.hourly.data ?? []
  const tvl = aggregate.at(-1)?.[1] ?? 0
  const tvlOneDayAgo = aggregate.at(-25)?.[1] ?? 0
  const tvlSevenDaysAgo = aggregate[0]?.[1] ?? 0

  const tvlBreakdown = getTVLBreakdown(
    tvl,
    projectData?.tokens ?? [],
    project.config.associatedTokens ?? [],
  )

  let tvlWarning =
    tvlBreakdown.associated > 0.1
      ? toWarning(
          project.display.name,
          tvlBreakdown.associated,
          project.config.associatedTokens ?? [],
        )
      : undefined
  let warningSeverity: 'bad' | 'warning' | 'info' =
    tvlBreakdown.associated > 0.9 ? 'bad' : 'warning'
  if (project.display.name === 'Layer2.Finance') {
    tvlWarning =
      'The TVL is calculated incorrectly because it does not account for the assets locked in DeFi.'
    warningSeverity = 'info'
  }

  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.technology.provider,
    tvl: formatUSD(tvl),
    tvlBreakdown: {
      ...tvlBreakdown,
      warning: tvlWarning,
      warningSeverity,
    },
    oneDayChange: getPercentageChange(tvl, tvlOneDayAgo),
    sevenDayChange: getPercentageChange(tvl, tvlSevenDaysAgo),
    marketShare: formatPercent(tvl / aggregateTvl),
    purpose: project.display.purpose,
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
    const token = safeGetTokenByAssetId(assetId)
    if (!token) {
      other += tvl
    } else if (associatedTokens.includes(token.symbol)) {
      associated += tvl
    } else if (token.category === 'ether') {
      ether += tvl
    } else if (token.category === 'stablecoin') {
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
