import { ConfigReader } from '@l2beat/discovery'
import {
  type ContractValue,
  type DiscoveryOutput,
  get$Implementations,
} from '@l2beat/discovery-types'
import { assert, EthereumAddress, type ProjectId } from '@l2beat/shared-pure'
import { merge } from 'lodash'
import { bridges } from '../projects/bridges'
import { layer2s } from '../projects/layer2s'
import { layer3s } from '../projects/layer3s'
import type {
  Bridge,
  Layer2,
  Layer3,
  ProjectContract,
  ProjectPermission,
} from '../types'

type CommonProject = Layer2 | Layer3 | Bridge

type Params = { type: 'layer2' | 'layer3' | 'bridge'; hostChain?: string }

export function getCommonContractsIn(project: Params) {
  if (project.type === 'layer2') {
    return findCommonContractsMemoized(layer2s)
  }

  if (project.type === 'bridge') {
    return findCommonContractsMemoized(bridges)
  }

  if (project.type === 'layer3') {
    const projects = layer3s.filter((l3) => l3.hostChain === project.hostChain)
    return findCommonContractsMemoized(projects, project.hostChain as string)
  }

  return {}
}

const memo = new Map<string, Record<string, ReferenceInfo[]>>()

function findCommonContractsMemoized(
  projects: Pick<
    CommonProject,
    'id' | 'contracts' | 'permissions' | 'display'
  >[],
  hostChain: string = 'ethereum',
) {
  const key = hostChain + JSON.stringify(projects.map((p) => p.id))
  if (memo.has(key)) {
    const result = memo.get(key)
    assert(result !== undefined)
    return result
  }
  const result = findCommonContracts(projects, hostChain)
  memo.set(key, result)
  return result
}

function findCommonContracts(
  projects: Pick<
    CommonProject,
    'id' | 'contracts' | 'permissions' | 'display'
  >[],
  hostChain: string,
) {
  const configReader = new ConfigReader('../config')
  const allConfigs = configReader.readAllConfigsForChain(hostChain)
  const configs = allConfigs.filter((c) =>
    projects.map((p) => p.id.toString()).includes(c.name),
  )

  const discoveriesFull = configs.flatMap((c) => {
    const sharedModules = c.sharedModules.map((module) =>
      configReader.readDiscovery(module, c.chain),
    )
    const sharedContracts = sharedModules.flatMap((m) => m.contracts)
    const projectDiscovery = configReader.readDiscovery(c.name, c.chain)
    return {
      ...projectDiscovery,
      contracts: [...projectDiscovery.contracts, ...sharedContracts],
    }
  })
  const discoveries = discoveriesFull

  const projectAddresses = Object.fromEntries(
    discoveries.map((d) => [
      d.name,
      getProjectAddresses(d).map((a) => a.toString()),
    ]),
  )

  const occurrence: Record<string, number> = {}
  discoveries.forEach((d) =>
    addToOccurrences(projectAddresses[d.name], occurrence),
  )
  const repeatedAddresses = Object.entries(occurrence)
    .filter(([_, count]) => count > 1)
    .map(([address, _]) => address)

  const commonContracts: Record<string, ProjectId[]> = {}
  const commonEOAs: Record<string, ProjectId[]> = {}

  repeatedAddresses.forEach((address) => {
    const linkedProjectes = discoveries.filter((d) =>
      projectAddresses[d.name].includes(address),
    )

    const isEOA = linkedProjectes
      .flatMap((p) => p.eoas)
      .map((a) => a.toString())
      .includes(address)
    const isContract = linkedProjectes
      .flatMap((p) => p.contracts)
      .map((a) => a.address.toString())
      .includes(address)
    const isImplementation = linkedProjectes
      .flatMap((p) => p.contracts)
      .flatMap((a) => get$Implementations(a.values) ?? [])
      .map((a) => a.toString())
      .includes(address)

    if (isEOA) {
      commonEOAs[address] = linkedProjectes.map((p) => p.name as ProjectId)
    } else if (isContract || isImplementation) {
      commonContracts[address] = linkedProjectes.map((p) => p.name as ProjectId)
    }
  })

  const merged = merge(commonContracts, commonEOAs)
  const referenced = pickOutReferencedEntries(projects, merged)
  return referenced
}

type ReferenceInfo = {
  id: ProjectId
  usedAs: 'contract' | 'permission'
  targetName: string
  name: string
  slug: string
}

function pickOutReferencedEntries(
  projects: Pick<
    CommonProject,
    'id' | 'contracts' | 'permissions' | 'display'
  >[],
  commonContracts: Record<string, ProjectId[]>,
): Record<string, ReferenceInfo[]> {
  const result: Record<string, ReferenceInfo[]> = {}

  Object.entries(commonContracts).forEach(([address, projectIds]) => {
    projectIds.forEach((id) => {
      if (id.startsWith('shared-')) {
        return
      }

      const project = projects.find((p) => p.id === id)
      if (!project) {
        throw new Error('Invalid project type')
      }

      const contract = projectContainsAddressAsContract(project, address)
      const permission = getPermissionContainingAddress(project, address)
      if (contract !== undefined) {
        result[address] ??= []
        result[address].push({
          id,
          usedAs: 'contract',
          targetName: contract.name,
          name: project.display.name,
          slug: project.display.slug,
        })
      } else if (permission !== undefined) {
        result[address] ??= []
        result[address].push({
          id,
          usedAs: 'permission',
          targetName: permission.name,
          name: project.display.name,
          slug: project.display.slug,
        })
      }
    })
  })

  return result
}

function projectContainsAddressAsContract(
  project: Pick<CommonProject, 'contracts'>,
  address: string,
): ProjectContract | undefined {
  if (project.contracts === undefined) {
    return undefined
  }

  for (const chain in project.contracts.addresses ?? {}) {
    for (const contract of (project.contracts.addresses ?? {})[chain]) {
      if (
        contract.address.toString() === address ||
        (contract.upgradeability !== undefined &&
          contract.upgradeability.implementations
            .map((a) => a.toString())
            .includes(address))
      ) {
        return contract
      }
    }
  }

  return undefined
}

function getPermissionContainingAddress(
  project: Pick<CommonProject, 'permissions'>,
  address: string,
): ProjectPermission | undefined {
  if (!project.permissions) {
    return undefined
  }

  for (const perChain of Object.values(project.permissions)) {
    const all = [...(perChain.roles ?? []), ...(perChain.actors ?? [])]

    for (const permission of all) {
      if (permission.accounts.length > 1) {
        continue
      }

      if (
        permission.accounts.map((a) => a.address.toString()).includes(address)
      ) {
        return permission
      }
    }
  }

  return undefined
}

function getProjectAddresses(project: DiscoveryOutput) {
  const addresses: EthereumAddress[] = project.eoas.map((e) => e.address)
  addresses.push(
    ...project.contracts.flatMap((c) => get$Implementations(c.values)),
  )
  addresses.push(...project.contracts.map((c) => c.address))
  addresses.push(
    ...project.contracts.flatMap((c) => {
      return c.values
        ? Object.values(c.values).flatMap((v) => getAddresses(v))
        : []
    }),
  )

  return addresses
}

function getAddresses(value: ContractValue | undefined): EthereumAddress[] {
  if (Array.isArray(value)) {
    return value.flatMap(getAddresses)
  } else if (typeof value === 'object') {
    return Object.values(value).flatMap(getAddresses)
  } else if (typeof value === 'string') {
    try {
      return [EthereumAddress(value)]
    } catch {
      return []
    }
  }
  return []
}

function addToOccurrences(
  projectAddresses: string[],
  occurrence: Record<string, number>,
) {
  const seen: Record<string, boolean> = {}
  projectAddresses.forEach((addr) => {
    if (!seen[addr]) {
      occurrence[addr] ??= 0
      occurrence[addr] += 1
      seen[addr] = true
    }
  })
}
