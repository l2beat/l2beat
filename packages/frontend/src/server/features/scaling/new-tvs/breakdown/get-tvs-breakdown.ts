import type { TvsToken } from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import { type TokenId, assertUnreachable } from '@l2beat/shared-pure'
import { recordToSortedBreakdown } from './record-to-sorted-breakdown'
import type { BaseAssetBreakdownData, BreakdownRecord } from './types'

export async function getTvsBreakdown(
  projectTokens: TvsToken[],
  tokenValuesMap: Map<TokenId, TokenValueRecord>,
  gasTokens?: string[],
) {
  const breakdown: BreakdownRecord = {
    canonical: [],
    external: [],
    native: [],
  }

  for (const token of projectTokens) {
    const tokenValue = tokenValuesMap.get(token.id)
    if (!tokenValue) continue

    const tokenWithValues: BaseAssetBreakdownData = {
      ...token,
      iconUrl: token.iconUrl ?? '',
      usdValue: tokenValue.value,
      amount: tokenValue.amount,
      isGasToken: gasTokens?.includes(token.symbol.toUpperCase()),
    }

    switch (token.source) {
      case 'canonical':
        breakdown.canonical.push(tokenWithValues)
        break
      case 'external':
        breakdown.external.push(tokenWithValues)
        break
      case 'native':
        breakdown.native.push(tokenWithValues)
        break
      default:
        assertUnreachable(token.source)
    }
  }

  return recordToSortedBreakdown(breakdown)
}
