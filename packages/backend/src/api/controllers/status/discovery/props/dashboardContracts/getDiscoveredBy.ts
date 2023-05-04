import { ContractParameters, DiscoveryOutput } from '@l2beat/shared'

import { DiscoveryConfig } from '../../../../../../core/discovery/config/DiscoveryConfig'

export interface DiscoveredByInfo {
  name: string
  address: string
}

export function getDiscoveredBy(
  discovery: DiscoveryOutput,
  config: DiscoveryConfig,
  contract: ContractParameters,
): DiscoveredByInfo[] {
  const discoveredBy: DiscoveredByInfo[] = []
  for (const discoveredContract of discovery.contracts) {
    if (
      config.initialAddresses.includes(contract.address) ||
      contract.address === discoveredContract.address
    ) {
      continue
    }
    const discoveredFields = Object.values(discoveredContract.values ?? {})
    discoveredFields.push(Object.values(discoveredContract.upgradeability))

    if (
      JSON.stringify(discoveredFields).includes(contract.address.toString())
    ) {
      discoveredBy.push({
        address: discoveredContract.address.toString(),
        name: discoveredContract.name,
      })
    }
  }
  return discoveredBy
}
