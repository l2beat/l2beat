import {
  assertUnreachable,
  ContractParameters,
  EthereumAddress,
  UpgradeabilityParameters,
} from '@l2beat/shared'

export function getAddresses(contract: ContractParameters): EthereumAddress[] {
  const addresses = gatherAddressesFromUpgradeability(contract.upgradeability)

  return [contract.address, ...addresses]
}

// TODO: Move to shared
// This function is duplicated in packages/config/scripts/checkVerifiedContracts/addresses.ts
export function gatherAddressesFromUpgradeability(
  item: UpgradeabilityParameters,
): EthereumAddress[] {
  const result: EthereumAddress[] = []

  switch (item.type) {
    case 'EIP1967 proxy':
    case 'ZeppelinOS proxy':
    case 'StarkWare diamond':
    case 'resolved delegate proxy':
    case 'call implementation proxy':
    case 'EIP897 proxy':
      result.push(item.implementation)
      break
    case 'StarkWare proxy':
      result.push(item.implementation)
      if (item.callImplementation) {
        result.push(item.callImplementation)
      }
      break
    case 'Arbitrum proxy':
      result.push(item.adminImplementation)
      result.push(item.userImplementation)
      break
    case 'new Arbitrum proxy':
      result.push(item.adminImplementation)
      result.push(item.userImplementation)
      result.push(item.implementation)
      break
    case 'gnosis safe':
      result.push(item.masterCopy)
      break
    case 'EIP2535 diamond proxy':
      result.push(...item.facets)
      break
    case 'immutable':
      // Ignoring types because no (admin/user)implementation included in them
      break
    default:
      // This code triggers a typescript compile-time error if not all cases have been covered
      assertUnreachable(item)
  }

  return result
}
