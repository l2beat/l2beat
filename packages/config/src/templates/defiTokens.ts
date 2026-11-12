import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type { ProjectDefiToken } from '../types'

/** A token with the address, symbol and name discovery read from it. */
export function discoveredDefiToken(
  discovery: ProjectDiscovery,
  contract: string,
  description: string,
): ProjectDefiToken {
  return {
    address: discovery.getContract(contract).address,
    symbol: discovery.getContractValue<string>(contract, 'symbol'),
    name: discovery.getContractValue<string>(contract, 'name'),
    description,
  }
}
