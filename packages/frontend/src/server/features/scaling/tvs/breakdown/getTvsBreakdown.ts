import type { ChainConfig, Project, ProjectContract } from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { ChainSpecificAddress, type TokenId } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'
import type { Address } from './extractAddressesFromTokenConfig'
import { extractAddressesFromTokenConfig } from './extractAddressesFromTokenConfig'
import type { BaseAssetBreakdownData } from './types'

export function getTvsBreakdown(
  project: Project<'tvsConfig', 'chainConfig' | 'contracts'>,
  tokenValuesMap: Map<TokenId, TokenValueRecord>,
  chains: ChainConfig[],
  targetTimestamp: UnixTime,
) {
  const breakdown: BaseAssetBreakdownData[] = []

  const projectTokens = project.tvsConfig
  const gasTokens = project.chainConfig?.gasTokens

  for (const token of projectTokens) {
    const tokenValue = tokenValuesMap.get(token.id)
    if (!tokenValue) continue

    const { addresses } = extractAddressesFromTokenConfig(token)
    const address = processAddresses(addresses, chains)
    const tokenWithValues: BaseAssetBreakdownData = {
      ...token,
      address,
      formula: token.valueForProject ?? token.amount,
      iconUrl: token.iconUrl ?? '',
      valueForProject: tokenValue.valueForProject,
      value: tokenValue.value,
      amount: tokenValue.amount,
      isGasToken: gasTokens?.includes(token.symbol.toUpperCase()),
      syncStatus: getSyncStatus(tokenValue.timestamp, targetTimestamp),
      bridgedUsing: token.bridgedUsing,
    }

    breakdown.push(tokenWithValues)
  }

  return breakdown.sort((a, b) => +b.valueForProject - +a.valueForProject)
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
