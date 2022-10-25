import { EthereumAddress } from '@l2beat/types'

import { Bridge } from './bridges'
import { ProjectUpgradeability } from './common/ProjectContracts'
import { Layer2 } from './layer2s'

export function getEnv(name: string, fallback?: string): string {
  const value = process.env[name]
  if (value !== undefined) {
    return value
  }
  if (fallback !== undefined) {
    return fallback
  }
  throw new Error(`Missing environment variable ${name}!`)
}

export function getUniqueContractsForProject(
  project: Layer2 | Bridge,
): EthereumAddress[] {
  const result = []
  if (project.contracts) {
    for (const contract of project.contracts.addresses) {
      result.push(EthereumAddress(contract.address))
      if (contract.upgradeability) {
        result.push(
          ...gatherAddressesFromUpgradeability(contract.upgradeability),
        )
      }
    }
  }
  // Cast to Set to remove duplicates
  return [...new Set(result)]
}

function gatherAddressesFromUpgradeability(
  item: ProjectUpgradeability,
): EthereumAddress[] {
  const result: string[] = []
  switch (item.type) {
    case 'Custom':
    case 'CustomWithoutAdmin':
    case 'EIP1967':
    case 'ZeppelinOs':
    case 'NutBerry':
      result.push(item.implementation)
      break
    case 'StarkWare':
      result.push(item.implementation)
      if (item.callImplementation) {
        result.push(item.callImplementation)
      }
      break
    case 'Arbitrum':
      result.push(item.adminImplementation)
      result.push(item.userImplementation)
      break
    case 'Beacon':
      result.push(item.beacon)
      result.push(item.implementation)
      break
    case 'Reference':
      // Ignoring type "Reference"
      break
    default:
      // This construct triggers a typescript compile-time error if not all cases has been covered
      ;((_: never) => {
        throw new Error(
          'There are more values to this type than handled in the switch statement.',
        )
      })(item)
  }
  return result.map(EthereumAddress)
}
