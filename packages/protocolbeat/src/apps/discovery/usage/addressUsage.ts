import type {
  ApiAddressUsageResponse,
  ApiEntrypointInfo,
  ApiProjectChain,
} from '../../../api/types'

export type UsageRelation = 'discovers' | 'references' | 'consumes-module'

export interface UsagePlace {
  project: string
  name?: string
  relation: UsageRelation
}

export type AddressUsageSummary =
  | { status: 'standalone' }
  | { status: 'duplicated'; places: UsagePlace[] }
  | {
      status: 'shared-module'
      module: string
      entrypoint: ApiEntrypointInfo | undefined
      places: UsagePlace[]
    }

const RELATION_ORDER: Record<UsageRelation, number> = {
  discovers: 0,
  references: 1,
  'consumes-module': 2,
}

export function summarizeAddressUsage(
  usage: ApiAddressUsageResponse,
  address: string,
  openedProject: string,
  sourceProject: string,
): AddressUsageSummary {
  const places = new Map<string, UsagePlace>()
  for (const entry of usage.sharedAddresses[address] ?? []) {
    if (entry.project !== openedProject) {
      places.set(entry.project, {
        project: entry.project,
        name: entry.name,
        relation: entry.viaModule === undefined ? 'discovers' : 'references',
      })
    }
  }

  const entrypoint = usage.entrypoints[address]
  const module =
    entrypoint?.project ??
    findOwningModule(usage, address, openedProject, sourceProject)

  if (module === undefined) {
    if (places.size === 0) {
      return { status: 'standalone' }
    }
    return { status: 'duplicated', places: sortPlaces(places) }
  }

  const modulePlaces = [module, ...(usage.moduleConsumers[module] ?? [])]
  for (const project of modulePlaces) {
    if (project !== openedProject && !places.has(project)) {
      places.set(project, {
        project,
        relation: project === module ? 'discovers' : 'consumes-module',
      })
    }
  }
  return {
    status: 'shared-module',
    module,
    entrypoint,
    places: sortPlaces(places),
  }
}

function findOwningModule(
  usage: ApiAddressUsageResponse,
  address: string,
  openedProject: string,
  sourceProject: string,
): string | undefined {
  if (Object.hasOwn(usage.moduleConsumers, sourceProject)) {
    return sourceProject
  }
  const discoveredByConsumedModule = usage.sharedAddresses[address]?.find(
    (entry) => usage.moduleConsumers[entry.project]?.includes(openedProject),
  )
  return discoveredByConsumedModule?.project
}

function sortPlaces(places: Map<string, UsagePlace>): UsagePlace[] {
  return [...places.values()].sort(
    (a, b) =>
      RELATION_ORDER[a.relation] - RELATION_ORDER[b.relation] ||
      a.project.localeCompare(b.project),
  )
}

export interface OverlapAddress {
  address: string
  name?: string
}

export interface ModuleUsage {
  module: string
  addressCount: number
  consumerCount: number
}

export interface ModuleCandidate {
  projects: string[]
  addresses: OverlapAddress[]
}

export interface ProjectOverlap {
  project: string
  addresses: OverlapAddress[]
}

export interface ProjectUsageSummary {
  addressCount: number
  standaloneCount: number
  duplicatedCount: number
  moduleAddressCount: number
  modules: ModuleUsage[]
  candidates: ModuleCandidate[]
  overlaps: ProjectOverlap[]
}

interface DuplicatedAddress extends OverlapAddress {
  projects: string[]
}

export function summarizeProjectUsage(
  usage: ApiAddressUsageResponse,
  openedProject: string,
  chains: ApiProjectChain[],
): ProjectUsageSummary {
  let addressCount = 0
  let standaloneCount = 0
  const moduleAddressCounts = new Map<string, number>()
  const duplicated: DuplicatedAddress[] = []

  for (const chain of chains) {
    const entries = [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ]
    for (const entry of entries) {
      const summary = summarizeAddressUsage(
        usage,
        entry.address,
        openedProject,
        chain.project,
      )
      addressCount++
      if (summary.status === 'standalone') {
        standaloneCount++
      } else if (summary.status === 'shared-module') {
        const count = moduleAddressCounts.get(summary.module) ?? 0
        moduleAddressCounts.set(summary.module, count + 1)
      } else {
        duplicated.push({
          address: entry.address,
          name: entry.name,
          projects: summary.places.map((x) => x.project),
        })
      }
    }
  }

  return {
    addressCount,
    standaloneCount,
    duplicatedCount: duplicated.length,
    moduleAddressCount: addressCount - standaloneCount - duplicated.length,
    modules: [...moduleAddressCounts]
      .map(([module, addressCount]) => ({
        module,
        addressCount,
        consumerCount: usage.moduleConsumers[module]?.length ?? 0,
      }))
      .sort(
        (a, b) =>
          b.addressCount - a.addressCount || a.module.localeCompare(b.module),
      ),
    candidates: groupByProjectSet(duplicated),
    overlaps: groupByProject(duplicated),
  }
}

function groupByProjectSet(duplicated: DuplicatedAddress[]): ModuleCandidate[] {
  const candidates = new Map<string, ModuleCandidate>()
  for (const { projects, ...address } of duplicated) {
    const sortedProjects = projects.toSorted()
    const key = sortedProjects.join(',')
    const candidate = candidates.get(key) ?? {
      projects: sortedProjects,
      addresses: [],
    }
    candidate.addresses.push(address)
    candidates.set(key, candidate)
  }
  return [...candidates.values()]
    .filter((candidate) => candidate.addresses.length > 1)
    .sort(
      (a, b) =>
        b.addresses.length * b.projects.length -
          a.addresses.length * a.projects.length ||
        a.projects.join(',').localeCompare(b.projects.join(',')),
    )
}

function groupByProject(duplicated: DuplicatedAddress[]): ProjectOverlap[] {
  const overlaps = new Map<string, OverlapAddress[]>()
  for (const { projects, ...address } of duplicated) {
    for (const project of projects) {
      const addresses = overlaps.get(project) ?? []
      addresses.push(address)
      overlaps.set(project, addresses)
    }
  }
  return [...overlaps]
    .map(([project, addresses]) => ({ project, addresses }))
    .sort(
      (a, b) =>
        b.addresses.length - a.addresses.length ||
        a.project.localeCompare(b.project),
    )
}
