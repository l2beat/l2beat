import type { ContractParameters } from '@l2beat/discovery-types'
import {
  EthereumAddress,
  gatherAddressesFromUpgradeability,
} from '@l2beat/shared-pure'

export function getAddresses(
  contract: ContractParameters,
  eoas: EthereumAddress[],
): EthereumAddress[] {
  const addresses = gatherAddressesFromUpgradeability(
    contract.upgradeability,
    eoas,
  )

  return [contract.address, ...addresses]
}
