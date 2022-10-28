import { EthereumAddress } from '@l2beat/types'

import { Bridge, Layer2 } from '../../src'
import { ProjectUpgradeability } from '../../src/common/ProjectContracts'
import { VerificationMap } from './output'
import { withoutDuplicates } from './utils'

export function getUniqueContractsForAllProjects(
  projects: (Layer2 | Bridge)[],
): EthereumAddress[] {
  const addresses = projects.flatMap(getUniqueContractsForProject)
  return withoutDuplicates(addresses)
}

export function getUniqueContractsForProject(
  project: Layer2 | Bridge,
): EthereumAddress[] {
  const projectContracts = project.contracts?.addresses ?? []
  const mainAddresses = projectContracts.map((c) => EthereumAddress(c.address))
  const upgradeabilityAddresses = projectContracts
    .map((c) => c.upgradeability)
    .filter((u): u is ProjectUpgradeability => !!u) // remove undefined
    .flatMap((u) => gatherAddressesFromUpgradeability(u))
  const permissions = project.permissions ?? []
  const permissionAddresses = permissions
    .flatMap((permission) => permission.accounts)
    .filter((account) => account.type !== 'EOA')
    .map((account) => account.address)
    .map(EthereumAddress)

  return withoutDuplicates([
    ...mainAddresses,
    ...upgradeabilityAddresses,
    ...permissionAddresses,
  ])
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
      // This code triggers a typescript compile-time error if not all cases have been covered
      assertUnreachable(item)
  }
  return result.map(EthereumAddress)
}

function assertUnreachable(_: never): never {
  throw new Error(
    'There are more values to this type than handled in the switch statement.',
  )
}

export function areAllProjectContractsVerified(
  project: Layer2 | Bridge,
  addressVerificationMap: VerificationMap,
): boolean {
  const projectAddresses = getUniqueContractsForProject(project)
  return projectAddresses.every(
    (address) => addressVerificationMap[address.toString()],
  )
}
