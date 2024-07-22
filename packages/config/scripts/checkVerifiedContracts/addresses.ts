import { EthereumAddress } from '@l2beat/shared-pure'

import {
  DaLayer,
  OnChainDaBridge,
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

export function getUniqueContractsForAllDaLayers(
  daLayers: DaLayer[],
  chain: string,
): EthereumAddress[] {
  const addresses = daLayers.flatMap((daLayer) =>
    getUniqueContractsFromList(getDaLayerContractsForChain(daLayer, chain)),
  )
  return withoutDuplicates(addresses)
}

export function getUniqueContractsForProject(
  project: Project,
  chain: string,
): EthereumAddress[] {
  const projectContracts = getProjectContractsForChain(project, chain)
  return getUniqueContractsFromList(projectContracts)
}

export function getUniqueContractsFromList(
  contracts: ScalingProjectContract[],
): EthereumAddress[] {
  const mainAddresses = contracts.flatMap((c) => getAddresses(c))
  const upgradeabilityAddresses = contracts
    .filter(isSingleAddress)
    .map((c) => c.upgradeability)
    .filter((u): u is ScalingProjectUpgradeability => !!u) // remove undefined
    .flatMap((u) => u.implementations)

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

export function getDaLayerContractsForChain(daLayer: DaLayer, chain: string) {
  const contracts = daLayer.bridges
    .filter((b): b is OnChainDaBridge => b.type === 'OnChainBridge')
    .flatMap((b) => b.contracts.addresses)
  return contracts.filter((a) => isContractOnChain(a, chain))
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

export function areAllDaLayersContractsVerified(
  daLayer: DaLayer,
  addressVerificationMapPerChain: VerificationMapPerChain,
): boolean {
  for (const [chain, addressVerificationMap] of Object.entries(
    addressVerificationMapPerChain,
  )) {
    const daLayerAddresses = getUniqueContractsFromList(
      getDaLayerContractsForChain(daLayer, chain),
    )
    if (!areAllAddressesVerified(daLayerAddresses, addressVerificationMap)) {
      return false
    }
  }
  return true
}

export function areAllAddressesVerified(
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
