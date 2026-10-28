import type { Project, ProjectService } from '@l2beat/config'
import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import type { ApiProjectCategory, ApiProjectsResponse } from './types'

const CATEGORY_KEYS = [
  'scalingInfo',
  'interopConfig',
  'zkCatalogInfo',
  'privacyInfo',
  'defiInfo',
  'archivedAt',
] as const

type CategorySource = Project<never, (typeof CATEGORY_KEYS)[number]>

export async function getProjects(
  configReader: ConfigReader,
  projectService: ProjectService,
) {
  const entries = configReader.readAllDiscoveredProjects()
  const projectToDiscovery = new Map<string, DiscoveryOutput>()
  for (const entry of entries) {
    projectToDiscovery.set(entry, configReader.readDiscovery(entry))
  }

  const projects = await projectService.getProjects({
    optional: [...CATEGORY_KEYS],
  })
  const projectById = new Map<string, CategorySource>(
    projects.map((p) => [p.id, p]),
  )

  const response: ApiProjectsResponse = [...projectToDiscovery.entries()]
    .map(([name, discovery]) => ({
      name,
      category: getProjectCategory(name, projectById.get(name)),
      addresses: discovery.entries.map((e) => e.address.toLowerCase()),
      contractNames: discovery.entries
        .map((e) => e.name?.toLowerCase())
        .filter((x) => x !== undefined),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return response
}

export function getProjectCategory(
  name: string,
  project: CategorySource | undefined,
): ApiProjectCategory {
  if (name.startsWith('shared-')) {
    return 'sharedModules'
  }
  if (project === undefined) {
    return 'unlisted'
  }
  if (project.archivedAt !== undefined) {
    return 'archived'
  }
  if (project.scalingInfo !== undefined) {
    return getScalingCategory(project.scalingInfo.type)
  }
  if (project.privacyInfo !== undefined) {
    return 'privacy'
  }
  if (project.defiInfo !== undefined) {
    return 'defi'
  }
  if (project.interopConfig !== undefined) {
    return 'interop'
  }
  if (project.zkCatalogInfo !== undefined) {
    return 'zkCatalog'
  }
  return 'unlisted'
}

function getScalingCategory(
  type: NonNullable<CategorySource['scalingInfo']>['type'],
): ApiProjectCategory {
  if (type === 'Optimistic Rollup' || type === 'ZK Rollup') {
    return 'rollups'
  }
  if (type === 'Validium' || type === 'Optimium' || type === 'Plasma') {
    return 'validiumsAndOptimiums'
  }
  return 'others'
}
