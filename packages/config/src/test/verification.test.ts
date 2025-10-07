import {
  ConfigReader,
  type DiscoveryOutput,
  type EntryParameters,
  getChainShortName,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { assert, ChainSpecificAddress, notUndefined } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
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

        const discoveries = getDiscoveries(configReader, projectId)
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
): DiscoveryOutput[] {
  let discovery = undefined
  try {
    discovery = configReader.readDiscovery(project)
  } catch {}
  if (discovery === undefined) {
    return []
  }

  const result = [discovery]
  const referencedProjects = discovery.entries
    .map((e) => e.targetProject)
    .filter(notUndefined)
  const allReferencedProjects = uniq([
    ...referencedProjects,
    ...(discovery.sharedModules ?? []), // TODO remove once entrypoints are used instead of sharedModules
  ])
  if (allReferencedProjects) {
    for (const sharedModule of allReferencedProjects) {
      try {
        result.push(configReader.readDiscovery(sharedModule))
      } catch {}
    }
  }

  // TODO: this should be removed and covered by entrypoints and references
  const dependentDiscoveries = discovery.dependentDiscoveries ?? {}
  for (const projectName of Object.keys(dependentDiscoveries)) {
    result.push(configReader.readDiscovery(projectName))
  }
  return result
}

function containsAllAddresses(
  addresses: ChainSpecificAddress[],
  discoveries: DiscoveryOutput[],
): ChainSpecificAddress[] {
  const inDiscovery = uniq(discoveries.flatMap((d) => addressesInDiscovery(d)))
  const notFound = []
  for (const usedAddress of addresses) {
    if (!inDiscovery.includes(usedAddress)) {
      notFound.push(usedAddress)
    }
  }
  return notFound
}

function addressesInDiscovery(
  discovery: DiscoveryOutput,
): ChainSpecificAddress[] {
  return discovery.entries.flatMap((c) => [c.address, ...getImplementations(c)])
}

function getImplementations(entry: EntryParameters): ChainSpecificAddress[] {
  const implementations = entry.values?.['$implementation'] ?? []

  if (Array.isArray(implementations)) {
    return implementations.map((i) => ChainSpecificAddress(i.toString()))
  }
  return [ChainSpecificAddress(implementations.toString())]
}

type Project = ScalingProject | Bridge | BaseProject

function withoutDuplicates<T>(arr: T[]): T[] {
  return uniqBy(arr, JSON.stringify)
}

function getUniqueContractsForProject(
  project: Project,
  chain: string,
): ChainSpecificAddress[] {
  const projectContracts = getProjectContractsForChain(project, chain)
  const uniqueProjectContracts = getUniqueContractsFromList(
    projectContracts,
  ).map((c) => c)
  const permissionedAddresses = getPermissionedAddressesForChain(project, chain)

  return withoutDuplicates([
    ...uniqueProjectContracts,
    ...permissionedAddresses,
  ])
}

function getUniqueContractsFromList(
  contracts: ProjectContract[],
): ChainSpecificAddress[] {
  const mainAddresses = contracts.flatMap((c) => c.address)
  const upgradeabilityAddresses = contracts
    .filter((c) => !!c.upgradeability) // remove undefined
    .flatMap((c) => (c.upgradeability?.implementations ?? []).flatMap((a) => a))
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
        return {
          address: ChainSpecificAddress.from(
            getChainShortName(escrow.chain),
            escrow.address,
          ),
          ...escrow.contract,
        }
      })
      .filter((escrowContract) => escrowContract.chain === chain)
  }

  return [...contracts, ...escrows]
}

function getPermissionedAddressesForChain(
  project: Project,
  chain: string,
): ChainSpecificAddress[] {
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
