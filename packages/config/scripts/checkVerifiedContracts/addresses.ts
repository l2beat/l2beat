import { assertUnreachable, EthereumAddress } from '@l2beat/shared-pure'

import {
  isSingleAddress,
  ScalingProjectContract,
  ScalingProjectUpgradeability,
} from '../../src'
import { VerificationMapPerChain } from './output'
import { Project } from './types'
import { withoutDuplicates } from './utils'

export function getUniqueContractsForAllProjects(
  projects: Project[],
  chain: string,
): EthereumAddress[] {
  const addresses = projects.flatMap((project) =>
    getUniqueContractsForProject(project, chain),
  )
  return withoutDuplicates(addresses)
}

export function getUniqueContractsForProject(
  project: Project,
  chain: string,
): EthereumAddress[] {
  const projectContracts = getProjectContractsForChain(project, chain)
  const mainAddresses = projectContracts.flatMap((c) => getAddresses(c))
  const upgradeabilityAddresses = projectContracts
    .filter(isSingleAddress)
    .map((c) => c.upgradeability)
    .filter((u): u is ScalingProjectUpgradeability => !!u) // remove undefined
    .flatMap((u) => gatherAddressesFromUpgradeability(u))

  return withoutDuplicates([...mainAddresses, ...upgradeabilityAddresses])
}

function getProjectContractsForChain(project: Project, chain: string) {
  const contracts = (project.contracts?.addresses ?? []).filter((contract) =>
    isContractOnChain(contract, chain),
  )
  const escrows = project.config.escrows
    .flatMap((escrow) => {
      if (!escrow.newVersion) {
        return []
      }
      return { address: escrow.address, ...escrow.contract }
    })
    .filter((escrowContract) => isContractOnChain(escrowContract, chain))

  return [...contracts, ...escrows]
}

function isContractOnChain(contract: ScalingProjectContract, chain: string) {
  // For backwards compatibility, we assume that contracts without chain are for ethereum
  if (contract.chain === undefined && chain === 'ethereum') {
    return true
  }
  return contract.chain === chain
}

function gatherAddressesFromUpgradeability(
  item: ScalingProjectUpgradeability,
): EthereumAddress[] {
  const result: EthereumAddress[] = []

  switch (item.type) {
    case 'Custom':
    case 'CustomWithoutAdmin':
    case 'EIP1967 proxy':
    case 'Polygon proxy':
    case 'ZeppelinOS proxy':
    case 'StarkWare diamond':
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
    case 'Beacon':
      result.push(item.beacon)
      result.push(item.implementation)
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
    case 'Optics Beacon proxy':
      result.push(item.upgradeBeacon)
      result.push(item.beaconController)
      result.push(item.implementation)
      break
    case 'Reference':
    case 'immutable':
    case 'gnosis safe':
    case 'gnosis safe zodiac module':
    case 'EIP2535 diamond proxy':
    case 'Axelar proxy':
      // Ignoring types because no (admin/user)implementation included in them
      break
    default:
      // This code triggers a typescript compile-time error if not all cases have been covered
      assertUnreachable(item)
  }

  return result
}

export function areAllProjectContractsVerified(
  project: Project,
  addressVerificationMapPerChain: VerificationMapPerChain,
): boolean {
  for (const [chain, addressVerificationMap] of Object.entries(
    addressVerificationMapPerChain,
  )) {
    const projectAddresses = getUniqueContractsForProject(project, chain)
    if (!areAllAddressesVerified(projectAddresses, addressVerificationMap)) {
      return false
    }
  }
  return true
}

function areAllAddressesVerified(
  addresses: EthereumAddress[],
  addressVerificationMap: Record<string, boolean>,
): boolean {
  return addresses.every(
    (address) => addressVerificationMap[address.toString()],
  )
}

function getAddresses(c: ScalingProjectContract): EthereumAddress[] {
  if (isSingleAddress(c)) {
    return [c.address]
  } else {
    return c.multipleAddresses
  }
}
