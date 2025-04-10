import type { ChainConfig, TvsToken } from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import { type TokenId, assertUnreachable } from '@l2beat/shared-pure'
import { recordToSortedBreakdown } from './record-to-sorted-breakdown'
import type {
  BaseAssetBreakdownData,
  BreakdownRecord,
  CanonicalAssetBreakdownData,
} from './types'
import type { Address } from './extract-addresses'
import { extractAddresses } from './extract-addresses'

export async function getTvsBreakdown(
  projectTokens: TvsToken[],
  tokenValuesMap: Map<TokenId, TokenValueRecord>,
  chains: ChainConfig[],
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

    const { addresses, escrows } = extractAddresses(token)
    const address = processAddresses(addresses, chains)

    const tokenWithValues: BaseAssetBreakdownData = {
      ...token,
      address,
      iconUrl: token.iconUrl ?? '',
      usdValue: tokenValue.value,
      amount: tokenValue.amount,
      isGasToken: gasTokens?.includes(token.symbol.toUpperCase()),
    }

    switch (token.source) {
      case 'canonical': {
        const escrow = processAddresses(escrows, chains)
        const canonicalTokenWithValues: CanonicalAssetBreakdownData = {
          ...tokenWithValues,
          escrow,
        }
        breakdown.canonical.push(canonicalTokenWithValues)
        break
      }
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

function processAddresses(
  addresses: Address[],
  chains: ChainConfig[],
): BaseAssetBreakdownData['address'] {
  if (addresses.length > 1) {
    return 'multiple'
  }
  if (addresses.length === 1 && addresses[0]) {
    const explorer = chains.find(
      (c) => c.name === addresses[0]?.chain,
    )?.explorerUrl
    return {
      address: addresses[0].address,
      url: explorer ? `${explorer}/address/${addresses[0].address}` : undefined,
    }
  }
  return undefined
}
