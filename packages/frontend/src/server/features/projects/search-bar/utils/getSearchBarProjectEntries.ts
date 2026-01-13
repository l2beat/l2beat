import type {
  Project,
  ProjectContracts,
  ProjectPermissions,
} from '@l2beat/config'
import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import type { SearchBarProjectEntry } from '../types'
import { getSearchBarProjectKind } from './getSearchBarProjectKind'

function extractProjectAddresses(
  contracts: ProjectContracts | undefined,
  permissions: Record<string, ProjectPermissions> | undefined,
): EthereumAddress[] {
  const contractAddresses = Object.values(contracts?.addresses ?? {})
    .flat()
    .map((c) => ChainSpecificAddress.address(c.address))

  const permissionAddresses = Object.values(permissions ?? {})
    .flatMap((p) => [...(p.roles ?? []), ...(p.actors ?? [])])
    .flatMap((p) =>
      p.accounts.map((a) => ChainSpecificAddress.address(a.address)),
    )

  return [...contractAddresses, ...permissionAddresses]
}

export function getSearchBarProjectEntries<
  T extends Project<
    never,
    | 'scalingInfo'
    | 'daLayer'
    | 'daBridge'
    | 'isScaling'
    | 'isDaLayer'
    | 'isBridge'
    | 'ecosystemConfig'
    | 'zkCatalogInfo'
    | 'contracts'
    | 'permissions'
  >,
>(project: T, allProjects: T[]): SearchBarProjectEntry[] {
  const results: SearchBarProjectEntry[] = []
  if (
    !project.isScaling &&
    !project.isBridge &&
    !project.daLayer &&
    !project.daBridge &&
    !project.ecosystemConfig &&
    !project.zkCatalogInfo
  ) {
    return []
  }

  const common = {
    type: 'project',
    id: project.id,
    name: project.name,
    iconUrl: getProjectIcon(project.slug),
    kind: getSearchBarProjectKind(project),
    isUpcoming: false,
    projectAddresses: extractProjectAddresses(
      project.contracts,
      project.permissions,
    ),
    tags: [project.slug],
  } satisfies Partial<SearchBarProjectEntry>

  if (project.isScaling) {
    results.push({
      ...common,
      href: `/scaling/projects/${project.slug}`,
      category: 'scaling',
      scalingCategory: project.scalingInfo?.type,
    })
  }

  if (project.isBridge) {
    results.push({
      ...common,
      href: `/bridges/projects/${project.slug}`,
      category: 'bridges',
    })
  }

  if (project.daLayer) {
    if (project.daLayer.usedWithoutBridgeIn.length > 0) {
      results.push({
        ...common,
        id: `${project.id}-no-bridge`,
        name: `${project.name} without a DA bridge`,
        href: `/data-availability/projects/${project.slug}/no-bridge`,
        category: 'da',
        tags: [project.slug, 'no-bridge'],
      })
    }
  }

  if (project.daBridge) {
    const layer = allProjects.find((x) => x.id === project.daBridge?.daLayer)
    if (layer) {
      results.push({
        ...common,
        id: `${layer.id}-${project.id}`,
        name: `${layer.name} with ${project.daBridge.name}`,
        href: `/data-availability/projects/${layer.slug}/${project.slug}`,
        category: 'da',
        tags: [layer.slug, project.slug],
      })
    }
  }

  if (project.ecosystemConfig) {
    results.push({
      ...common,
      href: `/ecosystems/${project.slug}`,
      category: 'ecosystems',
    })
  }

  if (project.zkCatalogInfo) {
    results.push({
      ...common,
      href: `/zk-catalog/${project.slug}`,
      category: 'zkCatalog',
    })
  }

  return results
}
