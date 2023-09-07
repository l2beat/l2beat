import { ConfigReader } from '@l2beat/discovery'
import type { ContractParameters } from '@l2beat/discovery-types'
import { ChainId, EthereumAddress } from '@l2beat/shared-pure'

export async function findUnknownContracts(
  name: string,
  contracts: ContractParameters[],
  configReader: ConfigReader,
  chain: ChainId,
): Promise<EthereumAddress[]> {
  const committed = await configReader.readDiscovery(name, chain)

  const unknownContracts = contracts
    .filter((contract) => {
      return !committed.contracts.find((c) => c.address === contract.address)
    })
    .map((contract) => contract.address)

  return unknownContracts
}
