import type { DiscoveryConfig } from '@l2beat/discovery'
import type {
  ContractParameters,
  DiscoveryOutput,
} from '@l2beat/discovery-types'

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
