import type { ChainConfig, Formula, TvsToken } from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { type TokenId, assertUnreachable } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'
import type { Address } from './extract-addresses'
import { extractAddresses } from './extract-addresses'
import { recordToSortedBreakdown } from './record-to-sorted-breakdown'
import type {
  BaseAssetBreakdownData,
  BreakdownRecord,
  CanonicalAssetBreakdownData,
} from './types'

export async function getTvsBreakdown(
  projectTokens: TvsToken[],
  tokenValuesMap: Map<TokenId, TokenValueRecord>,
  chains: ChainConfig[],
  targetTimestamp: UnixTime,
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
      formula: token.amount as Formula,
      iconUrl: token.iconUrl ?? '',
      usdValue: tokenValue.value,
      amount: tokenValue.amount,
      isGasToken: gasTokens?.includes(token.symbol.toUpperCase()),
      syncStatus: getSyncStatus(tokenValue.timestamp, targetTimestamp),
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

function getSyncStatus(valueTimestamp: UnixTime, targetTimestamp: UnixTime) {
  if (valueTimestamp < targetTimestamp) {
    return `Token data is not synced since ${formatTimestamp(valueTimestamp, {
      mode: 'datetime',
      longMonthName: true,
    })}.`
  }
}
