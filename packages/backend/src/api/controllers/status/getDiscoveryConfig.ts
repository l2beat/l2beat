import { EthereumAddress } from '@l2beat/shared'

import { ConfigReader } from '../../../core/discovery/ConfigReader'

interface ContractConfig {
  name: string
  address: EthereumAddress
  watched?: string[]
  ignoredInWatchmode?: string[]
  ignored?: string[]
  rest?: string[]
}

export async function getDiscoveryConfig(
  project: string,
): Promise<ContractConfig[]> {
  const configReader = new ConfigReader()
  const discovery = await configReader.readDiscovery(project)

  const result = discovery.contracts.map((contract) => ({
    name: contract.name,
    address: contract.address,
  }))

  return result
}
