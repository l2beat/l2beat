import { safeGetTokenByAssetId } from '@l2beat/config'
import { TvlApiToken } from '@l2beat/shared-pure'

import { TVLBreakdownProps } from '../../components/TVLBreakdown'
import { formatPercent } from '../utils'

export function getTvlBreakdown(
  name: string,
  associatedTokens: string[],
  total: number,
  tokens: TvlApiToken[],
): TVLBreakdownProps {
  const partial = getPartialTVLBreakdown(associatedTokens, total, tokens)
  return {
    ...partial,
    label: getTVLBreakdownLabel(partial, associatedTokens),
    ...getTvlWarning(partial, name, associatedTokens),
  }
}

function getPartialTVLBreakdown(
  associatedTokens: string[],
  total: number,
  tokens: TvlApiToken[],
) {
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

  const empty = total === 0
  return {
    empty,
    associated: empty ? 0 : associated / total,
    ether: empty ? 0 : ether / total,
    stable: empty ? 0 : stable / total,
    other: empty ? 0 : other / total,
  }
}

function getTVLBreakdownLabel(
  breakdown: ReturnType<typeof getPartialTVLBreakdown>,
  associatedTokens: string[],
) {
  if (breakdown.empty) {
    return 'No tokens'
  }
  const toLabel = (text: string, x: number) =>
    x === 0 ? '' : `${text} – ${(x * 100).toFixed(2)}%`

  return [
    toLabel(associatedTokens.join(' and '), breakdown.associated),
    toLabel('Ether', breakdown.ether),
    toLabel('Stablecoins', breakdown.stable),
    toLabel('Other', breakdown.other),
  ]
    .filter((x) => x !== '')
    .join('<br>')
}

function getTvlWarning(
  breakdown: ReturnType<typeof getPartialTVLBreakdown>,
  name: string,
  associatedTokens: string[],
) {
  let warning: string | undefined
  if (breakdown.associated > 0.1) {
    const percent = formatPercent(breakdown.associated)
    if (associatedTokens.length === 1) {
      const what = `The ${associatedTokens[0]} token associated with ${name}`
      warning = `${what} accounts for ${percent} of the TVL!`
    } else {
      const joined = associatedTokens.join(' and ')
      const what = `The ${joined} tokens associated with ${name}`
      warning = `${what} account for ${percent} of the TVL!`
    }
  }
  const warningSeverity: 'bad' | 'warning' =
    breakdown.associated > 0.9 ? 'bad' : 'warning'
  return { warning, warningSeverity }
}
