import type {
  Project,
  ProjectContracts,
  ProjectPermissions,
} from '@l2beat/config'
import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import { env } from '~/env'
import { manifest } from '~/utils/Manifest'
import type { SearchBarProjectEntry } from '../types'

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

function dedupeTags(tags: Array<string | undefined>): string[] {
  return [...new Set(tags.filter((tag): tag is string => !!tag))]
}

export function getSearchBarProjectEntries<
  T extends Project<
    never,
    | 'scalingInfo'
    | 'daLayer'
    | 'daBridge'
    | 'interopConfig'
    | 'isScaling'
    | 'isDaLayer'
    | 'ecosystemConfig'
    | 'zkCatalogInfo'
    | 'contracts'
    | 'permissions'
  >,
>(project: T, allProjects: T[]): SearchBarProjectEntry[] {
  const results: SearchBarProjectEntry[] = []
  if (
    !project.isScaling &&
    !project.daLayer &&
    !project.daBridge &&
    !project.ecosystemConfig &&
    !project.interopConfig &&
    !project.zkCatalogInfo
  ) {
    return []
  }

  const commonTags = dedupeTags([project.slug, project.name, project.shortName])

  const common = {
    type: 'project',
    id: project.id,
    name: project.name,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    isUpcoming: false,
    projectAddresses: extractProjectAddresses(
      project.contracts,
      project.permissions,
    ),
    tags: commonTags,
  } satisfies Partial<SearchBarProjectEntry>

  if (project.isScaling) {
    results.push({
      ...common,
      href: `/scaling/projects/${project.slug}`,
      category: 'scaling',
      kind: project.scalingInfo?.layer ?? 'layer2',
      scalingCategory: project.scalingInfo?.type,
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
        kind: 'da',
        tags: dedupeTags([...commonTags, 'no-bridge']),
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
        kind: 'da',
        tags: dedupeTags([layer.slug, layer.name, ...commonTags]),
      })
    }
  }

  if (project.ecosystemConfig) {
    results.push({
      ...common,
      href: `/ecosystems/${project.slug}`,
      category: 'ecosystems',
      kind: 'ecosystem',
    })
  }

  if (project.interopConfig && env.CLIENT_SIDE_INTEROP_DETAILED_PAGES) {
    results.push({
      ...common,
      name: project.interopConfig.name ?? project.name,
      href: `/interop/protocols/${project.slug}`,
      category: 'interop',
      kind: 'interop',
      tags: dedupeTags([
        ...commonTags,
        project.interopConfig.name,
        project.interopConfig.shortName,
        'interop',
      ]),
    })
  }

  if (project.zkCatalogInfo) {
    results.push({
      ...common,
      href: `/zk-catalog/${project.slug}`,
      category: 'zkCatalog',
      kind: 'zkCatalog',
    })
  }

  return results
}
