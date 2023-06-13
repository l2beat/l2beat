import { ConfigReader } from '@l2beat/discovery'
import { ContractParameters, EthereumAddress } from '@l2beat/shared-pure'

export async function findUnknownContracts(
  name: string,
  contracts: ContractParameters[],
  configReader: ConfigReader,
): Promise<EthereumAddress[]> {
  const committed = await configReader.readDiscovery(name)

  const unknownContracts = contracts
    .filter((contract) => {
      return !committed.contracts.find((c) => c.address === contract.address)
    })
    .map((contract) => contract.address)

  return unknownContracts
}
