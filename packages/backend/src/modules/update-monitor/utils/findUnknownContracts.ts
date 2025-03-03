import type { ConfigReader, ContractParameters } from '@l2beat/discovery'
import type { EthereumAddress } from '@l2beat/shared-pure'

export function findUnknownContracts(
  name: string,
  contracts: ContractParameters[],
  configReader: ConfigReader,
  chain: string,
): EthereumAddress[] {
  const committed = configReader.readDiscovery(name, chain)

  const unknownContracts = contracts
    .filter((contract) => {
      return !committed.contracts.find((c) => c.address === contract.address)
    })
    .map((contract) => contract.address)

  return unknownContracts
}
