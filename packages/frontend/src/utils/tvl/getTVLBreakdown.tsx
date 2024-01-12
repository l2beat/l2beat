import { safeGetTokenByAssetId } from '@l2beat/config'
import { TvlApiToken } from '@l2beat/shared-pure'
import React from 'react'

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

/**
 * @notice Unify once classic TVL API is deprecated
 */
function getPartialTVLBreakdown(
  associatedTokens: string[],
  total: number,
  tokens: TvlApiToken[],
) {
  let associated = 0
  let ether = 0
  let stable = 0
  let other = 0

  for (const token of tokens) {
    const safeToken = safeGetTokenByAssetId(token.assetId)
    if (!safeToken) {
      other += token.usdValue
    } else if (associatedTokens.includes(safeToken.symbol)) {
      associated += token.usdValue
    } else if (safeToken.category === 'ether') {
      ether += token.usdValue
    } else if (safeToken.category === 'stablecoin') {
      stable += token.usdValue
    } else {
      other += token.usdValue
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
    return <span>No tokens</span>
  }
  const toLabel = (text: string, x: number) =>
    x === 0 ? null : <div>{`${text} – ${(x * 100).toFixed(2)}%`}</div>

  return (
    <div>
      {toLabel(associatedTokens.join(' and '), breakdown.associated)}
      {toLabel('Ether', breakdown.ether)}
      {toLabel('Stablecoins', breakdown.stable)}
      {toLabel('Other', breakdown.other)}
    </div>
  )
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
