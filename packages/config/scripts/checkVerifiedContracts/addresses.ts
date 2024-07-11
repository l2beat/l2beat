import { EthereumAddress } from '@l2beat/shared-pure'

import {
  ScalingProjectContract,
  ScalingProjectUpgradeability,
  isSingleAddress,
} from '../../src'
import { VerificationMapPerChain } from './output'
import { Project } from './types'
import { withoutDuplicates } from './utils'
import { get$Implementations } from '@l2beat/discovery-types'

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
    .flatMap((u) => get$Implementations(u))

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
