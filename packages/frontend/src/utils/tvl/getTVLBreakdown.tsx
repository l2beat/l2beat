import { safeGetTokenByAssetId } from '@l2beat/config'
import { TvlApiToken } from '@l2beat/shared-pure'
import React, { ReactNode } from 'react'

import { Square } from '../../components/Square'
import { TokenBreakdownProps } from '../../components/breakdown/TokenBreakdown'
import { formatPercent } from '../utils'

export function getTvlBreakdown(
  name: string,
  associatedTokens: string[],
  total: number,
  tokens: TvlApiToken[],
): TokenBreakdownProps {
  const partial = getPartialTVLBreakdown(associatedTokens, total, tokens)

  return {
    ...partial,
    label: getTVLBreakdownLabel(partial, associatedTokens),
    ...getTvlWarning(partial.associated, name, associatedTokens),
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
  const sum =
    breakdown.associated + breakdown.ether + breakdown.stable + breakdown.other
  if (sum === 0) {
    return <span>No tokens</span>
  }

  return (
    <div>
      <Row value={breakdown.associated}>
        <Square variant="associated" size="small" />
        <span>{associatedTokens.join(' and ')}</span>
      </Row>
      <Row value={breakdown.ether}>
        <Square variant="ether" size="small" />
        <span>Ether</span>
      </Row>
      <Row value={breakdown.stable}>
        <Square variant="stable" size="small" />
        <span>Stablecoins</span>
      </Row>
      <Row value={breakdown.other}>
        <Square variant="other" size="small" />
        <span>Other</span>
      </Row>
    </div>
  )
}

function Row({ children, value }: { children: ReactNode; value: number }) {
  if (value === 0) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-x-6">
      <span className="flex items-center gap-1">{children}</span>
      <span className="font-semibold">{(value * 100).toFixed(2)}%</span>
    </div>
  )
}

export function getTvlWarning(
  associatedRatio: ReturnType<typeof getPartialTVLBreakdown>['associated'],
  name: string,
  associatedTokens: string[],
) {
  let warning: string | undefined
  if (associatedRatio > 0.1) {
    const percent = formatPercent(associatedRatio)
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
    associatedRatio > 0.8 ? 'bad' : 'warning'
  return { warning, warningSeverity }
}
