// TODO: Move to shared

import { assertUnreachable } from '../tools'
import { EthereumAddress, UpgradeabilityParameters } from '../types'

export function gatherAddressesFromUpgradeability(
  item: UpgradeabilityParameters,
): EthereumAddress[] {
  const result: EthereumAddress[] = []

  switch (item.type) {
    case 'EIP1967 proxy':
    case 'Polygon proxy':
    case 'ZeppelinOS proxy':
    case 'resolved delegate proxy':
    case 'call implementation proxy':
    case 'EIP897 proxy':
    case 'Eternal Storage proxy':
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
    case 'StarkWare diamond':
      result.push(item.implementation)
      result.push(...Object.values(item.facets))
      break
    case 'zkSync Lite proxy':
      result.push(item.implementation)
      result.push(item.additional)
      break
    case 'Polygon Extension proxy':
      result.push(item.implementation)
      result.push(item.extension)
      break
    case 'zkSpace proxy':
      result.push(item.implementation)
      result.push(...item.additional)
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
