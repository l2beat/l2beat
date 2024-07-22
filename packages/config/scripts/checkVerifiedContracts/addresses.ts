import { EthereumAddress } from '@l2beat/shared-pure'

import {
  ScalingProjectContract,
  ScalingProjectUpgradeability,
  isSingleAddress,
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
    .flatMap((u) => u.implementations)
  const permissionedAddresses = getPermissionedAddressesForChain(project, chain)

  return withoutDuplicates([
    ...mainAddresses,
    ...upgradeabilityAddresses,
    ...permissionedAddresses,
  ])
}

function getProjectContractsForChain(project: Project, chain: string) {
  const contracts = (project.contracts?.addresses ?? []).filter((contract) =>
    isContractOnChain(contract.chain, chain, project),
  )
  const escrows = project.config.escrows
    .flatMap((escrow) => {
      if (!escrow.newVersion) {
        return []
      }
      return { address: escrow.address, ...escrow.contract }
    })
    .filter((escrowContract) =>
      isContractOnChain(escrowContract.chain, chain, project),
    )

  return [...contracts, ...escrows]
}

function getPermissionedAddressesForChain(project: Project, chain: string) {
  const permissions =
    project.permissions === 'UnderReview' ? [] : project.permissions ?? []
  return permissions
    .filter((p) => isContractOnChain(p.chain, chain, project))
    .flatMap((p) => [...p.accounts, ...(p.participants ?? [])])
    .filter((p) => p.type !== 'EOA')
    .map((p) => p.address)
}

function isContractOnChain(
  contractChain: string | undefined,
  chain: string,
  project: Project,
) {
  if (contractChain === undefined) {
    // For backwards compatibility, we assume that L2 contracts without chain are for ethereum
    contractChain = project.type === 'layer3' ? project.hostChain : 'ethereum'
  }
  return contractChain === chain
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
