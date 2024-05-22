import { ConfigReader } from '@l2beat/discovery'
import { ContractValue, DiscoveryOutput } from '@l2beat/discovery-types'
import { EthereumAddress, Hash256, ProjectId } from '@l2beat/shared-pure'
import { merge } from 'lodash'
import {
  Project,
  ScalingProjectContract,
  ScalingProjectPermission,
  bridges,
  layer2s,
  layer3s,
} from '..'
import { gatherAddressesFromUpgradeability } from '../../scripts/checkVerifiedContracts/addresses'
import { hashJson } from '@l2beat/shared'

export function getCommonContractsIn(project: Project) {
  if (project.type === 'layer2') {
    return findCommonContractsMemoized(layer2s)
  } else if (project.type === 'bridge') {
    return findCommonContractsMemoized(bridges)
} else if (project.type === 'layer3' && project.hostChain !== 'Multiple') {
    const projects = layer3s.filter((l3) => l3.hostChain === project.hostChain)
    return findCommonContractsMemoized(projects, project.hostChain as string)
  } else {
    return {}
  }
}

const memo = new Map<Hash256, Record<string, ReferenceInfo[]>>()

function findCommonContractsMemoized(
  projects: Pick<Project, 'id' | 'contracts' | 'permissions' | 'display'>[],
  hostChain: string = 'ethereum',
) {
    const hash = hashJson(hostChain + JSON.stringify(projects.map(p => p.id)))
    if (memo.has(hash)) {
      return memo.get(hash)
    }
    const result = findCommonContracts(projects, hostChain)
    memo.set(hash, result)
    return result
}

function findCommonContracts(
  projects: Pick<Project, 'id' | 'contracts' | 'permissions' | 'display'>[],
  hostChain: string,
) {
  const configReader = new ConfigReader('../backend')
  const configs = configReader.readAllConfigsForChain(hostChain)
  const discoveriesFull = configs.map((c) =>
    configReader.readDiscovery(c.name, c.chain),
  )
  const discoveries = getFilteredDiscoveries(projects, discoveriesFull)

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
      .flatMap((a) => a.implementations ?? [])
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
  projects: Pick<Project, 'id' | 'contracts' | 'permissions' | 'display'>[],
  commonContracts: Record<string, ProjectId[]>,
): Record<string, ReferenceInfo[]> {
  const result: Record<string, ReferenceInfo[]> = {}

  Object.entries(commonContracts).forEach(([address, projectIds]) => {
    projectIds.forEach((id) => {
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
  project: Pick<Project, 'contracts'>,
  address: string,
): ScalingProjectContract | undefined {
  if (project.contracts === undefined) {
    return undefined
  }

  for (const contract of project.contracts.addresses) {
    if (
      'address' in contract &&
      (contract.address.toString() === address ||
        (contract.upgradeability !== undefined &&
          gatherAddressesFromUpgradeability(contract.upgradeability)
            .map((a) => a.toString())
            .includes(address)))
    ) {
      return contract
    }
    if (
      'multipleAddresses' in contract &&
      contract.multipleAddresses.map((a) => a.toString()).includes(address)
    ) {
      return contract
    }
  }

  return undefined
}

function getPermissionContainingAddress(
  project: Pick<Project, 'permissions'>,
  address: string,
): ScalingProjectPermission | undefined {
  if (
    project.permissions === undefined ||
    project.permissions === 'UnderReview'
  ) {
    return undefined
  }

  for (const permission of project.permissions) {
    if (permission.accounts.length > 1) {
      continue
    }

    if (
      permission.accounts.map((a) => a.address.toString()).includes(address)
    ) {
      return permission
    }
  }

  return undefined
}

function getFilteredDiscoveries(
  projects: Pick<Project, 'id'>[],
  discoveriesFull: DiscoveryOutput[],
) {
  return discoveriesFull.filter((d) =>
    projects.map((p) => p.id.toString()).includes(d.name),
  )
}

function getProjectAddresses(project: DiscoveryOutput) {
  const addresses: EthereumAddress[] = []
  addresses.push(...project.eoas)
  addresses.push(...project.contracts.flatMap((c) => c.implementations ?? []))
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
