import {
  ConfigReader,
  type DiscoveryOutput,
  type EntryParameters,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { uniq, uniqBy } from 'lodash'
import type { Bridge, ScalingProject } from '../internalTypes'
import { bridges } from '../processing/bridges'
import { layer2s } from '../processing/layer2s'
import { layer3s } from '../processing/layer3s'
import { refactored } from '../processing/refactored'
import type { BaseProject, ProjectContract } from '../types'
import { getChainNames } from '../utils/chains'

describe('verification status', () => {
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const projects = [...layer2s, ...bridges, ...layer3s, ...refactored]

  for (const project of projects) {
    for (const chain of getChainNames(project)) {
      const projectId = project.id.toString()
      it(`${projectId}:${chain}`, () => {
        const unverified = getUniqueContractsForProject(project, chain)

        if (unverified.length <= 0) {
          return
        }

        const discoveries = getDiscoveries(configReader, projectId, chain)
        assert(
          discoveries.length > 0,
          `Failed to read discovery for ${projectId} on ${chain}, create a discovery entry for it. It is needed for ${unverified.toString()}`,
        )

        const notFound = containsAllAddresses(unverified, discoveries)
        assert(
          notFound.length === 0,
          `Failed to find the following addresses in project discoveries: ${notFound.join(', ')}`,
        )
      })
    }
  }
})

function getDiscoveries(
  configReader: ConfigReader,
  project: string,
  chain: string,
): DiscoveryOutput[] {
  let discovery = undefined
  try {
    discovery = configReader.readDiscovery(project, chain)
  } catch {}
  if (discovery === undefined) {
    return []
  }

  const result = [discovery]
  const sharedModules = discovery.sharedModules ?? []
  if (sharedModules.length > 0) {
    for (const sharedModule of sharedModules) {
      result.push(configReader.readDiscovery(sharedModule, chain))
    }
  }

  return result
}

function containsAllAddresses(
  addresses: EthereumAddress[],
  discoveries: DiscoveryOutput[],
): EthereumAddress[] {
  const inDiscovery = uniq(discoveries.flatMap((d) => addressesInDiscovery(d)))
  const notFound = []
  for (const usedAddress of addresses) {
    if (!inDiscovery.includes(usedAddress)) {
      notFound.push(usedAddress)
    }
  }
  return notFound
}

function addressesInDiscovery(discovery: DiscoveryOutput): EthereumAddress[] {
  return discovery.entries.flatMap((c) => [c.address, ...getImplementations(c)])
}

function getImplementations(entry: EntryParameters): EthereumAddress[] {
  const implementations = entry.values?.['$implementation'] ?? []

  if (Array.isArray(implementations)) {
    return implementations.map((i) => EthereumAddress(i.toString()))
  }
  return [EthereumAddress(implementations.toString())]
}

type Project = ScalingProject | Bridge | BaseProject

function withoutDuplicates<T>(arr: T[]): T[] {
  return uniqBy(arr, JSON.stringify)
}

interface AddressOnChain {
  chain: string
  address: EthereumAddress
}

function getUniqueContractsForProject(
  project: Project,
  chain: string,
): EthereumAddress[] {
  const projectContracts = getProjectContractsForChain(project, chain)
  const uniqueProjectContracts = getUniqueContractsFromList(
    projectContracts,
  ).map((c) => c.address)
  const permissionedAddresses = getPermissionedAddressesForChain(project, chain)

  return withoutDuplicates([
    ...uniqueProjectContracts,
    ...permissionedAddresses,
  ])
}

function getUniqueContractsFromList(
  contracts: ProjectContract[],
): AddressOnChain[] {
  const mainAddresses = contracts.flatMap((c) => ({
    address: c.address,
    chain: c.chain,
  }))
  const upgradeabilityAddresses = contracts
    .filter((c) => !!c.upgradeability) // remove undefined
    .flatMap((c) =>
      (c.upgradeability?.implementations ?? []).flatMap((a) => ({
        address: a,
        chain: c.chain,
      })),
    )
  return withoutDuplicates([...mainAddresses, ...upgradeabilityAddresses])
}

function getProjectContractsForChain(
  project: Project,
  chain: string,
): ProjectContract[] {
  const contracts = (project.contracts?.addresses[chain] ?? []).filter(
    (contract) => contract.chain === chain,
  )
  let escrows: ProjectContract[] = []
  if ('config' in project) {
    escrows = project.config.escrows
      .flatMap((escrow) => {
        if (!escrow.contract) {
          return []
        }
        return { address: escrow.address, ...escrow.contract }
      })
      .filter((escrowContract) => escrowContract.chain === chain)
  }

  return [...contracts, ...escrows]
}

function getPermissionedAddressesForChain(project: Project, chain: string) {
  if (!project.permissions) {
    return []
  }

  const all = []
  const perChain = project.permissions[chain] ?? {}
  all.push(...(perChain.roles ?? []))
  all.push(...(perChain.actors ?? []))

  return all
    .filter((p) => p.chain === chain)
    .flatMap((p) => [...p.accounts, ...(p.participants ?? [])])
    .filter((p) => p.type !== 'EOA')
    .map((p) => p.address)
}
