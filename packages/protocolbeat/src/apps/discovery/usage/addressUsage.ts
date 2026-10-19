import type {
  ApiAddressUsageResponse,
  ApiEntrypointInfo,
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
