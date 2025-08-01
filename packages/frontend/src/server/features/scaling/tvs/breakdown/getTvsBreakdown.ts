import type {
  ChainConfig,
  Formula,
  Project,
  ProjectContract,
} from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import {
  assertUnreachable,
  ChainSpecificAddress,
  type TokenId,
} from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'
import type { Address } from './extractAddressesFromTokenConfig'
import { extractAddressesFromTokenConfig } from './extractAddressesFromTokenConfig'
import { recordToSortedBreakdown } from './recordToSortedBreakdown'
import type {
  BaseAssetBreakdownData,
  BreakdownRecord,
  CanonicalAssetBreakdownData,
} from './types'

export function getTvsBreakdown(
  project: Project<'tvsConfig', 'chainConfig' | 'contracts'>,
  tokenValuesMap: Map<TokenId, TokenValueRecord>,
  chains: ChainConfig[],
  targetTimestamp: UnixTime,
) {
  const breakdown: BreakdownRecord = {
    canonical: [],
    external: [],
    native: [],
  }

  const projectTokens = project.tvsConfig
  const gasTokens = project.chainConfig?.gasTokens
  const projectContracts = project.contracts?.addresses

  for (const token of projectTokens) {
    const tokenValue = tokenValuesMap.get(token.id)
    if (!tokenValue) continue

    const { addresses, escrows } = extractAddressesFromTokenConfig(token)
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
      bridgedUsing: token.bridgedUsing,
    }

    switch (token.source) {
      case 'canonical': {
        const escrow = processAddresses(escrows, chains, projectContracts)
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
  projectContracts?: Record<string, ProjectContract[]>,
): BaseAssetBreakdownData['address'] {
  if (addresses.length > 1) {
    return 'multiple'
  }
  if (addresses.length === 1 && addresses[0]) {
    const address = addresses[0]
    const contractName = projectContracts?.[address.chain]?.find(
      (c) =>
        ChainSpecificAddress.address(c.address).toLowerCase() ===
        address.address.toLowerCase(),
    )?.name
    const explorer = chains.find((c) => c.name === address.chain)?.explorerUrl

    return {
      address: address.address,
      url: explorer ? `${explorer}/address/${address.address}` : undefined,
      name: contractName,
    }
  }
  return undefined
}

function getSyncStatus(valueTimestamp: UnixTime, targetTimestamp: UnixTime) {
  if (valueTimestamp < targetTimestamp) {
    return `No token data since ${formatTimestamp(valueTimestamp, {
      mode: 'datetime',
      longMonthName: true,
    })}.`
  }
}
