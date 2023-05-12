import {
  ContractParameters,
  EthereumAddress,
  gatherAddressesFromUpgradeability,
} from '@l2beat/common'

export function getAddresses(contract: ContractParameters): EthereumAddress[] {
  const addresses = gatherAddressesFromUpgradeability(contract.upgradeability)

  return [contract.address, ...addresses]
}
