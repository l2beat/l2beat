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
    | 'interopConfig'
    | 'ecosystemConfig'
    | 'zkCatalogInfo'
    | 'privacyInfo'
    | 'defiInfo'
    | 'contracts'
    | 'permissions'
    | 'aliases'
  >,
>(project: T): SearchBarProjectEntry[] {
  const results: SearchBarProjectEntry[] = []
  if (
    !project.scalingInfo &&
    !project.ecosystemConfig &&
    !project.interopConfig &&
    !project.zkCatalogInfo &&
    !project.privacyInfo &&
    !(env.CLIENT_SIDE_DEFI_ENABLED && project.defiInfo)
  ) {
    return []
  }

  const commonTags = dedupeTags([
    project.slug,
    project.name,
    project.shortName,
    ...(project.aliases ?? []),
  ])

  const common = {
    type: 'project',
    id: project.id,
    name: project.name,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    projectAddresses: extractProjectAddresses(
      project.contracts,
      project.permissions,
    ),
    tags: commonTags,
  } satisfies Partial<SearchBarProjectEntry>

  if (project.scalingInfo) {
    results.push({
      ...common,
      href: `/layer2s/projects/${project.slug}`,
      category: 'l2',
      kind: project.scalingInfo?.layer ?? 'layer2',
      l2Category: project.scalingInfo?.type,
      tags: project.interopConfig
        ? dedupeTags([
            ...commonTags,
            project.interopConfig.name,
            project.interopConfig.shortName,
          ])
        : commonTags,
    })
  }

  if (project.ecosystemConfig) {
    results.push({
      ...common,
      href: `/ecosystems/${project.slug}`,
      category: 'ecosystems',
      kind: 'ecosystem',
    })
  }

  if (project.interopConfig && !project.scalingInfo) {
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

  if (project.privacyInfo) {
    results.push({
      ...common,
      href: `/privacy/projects/${project.slug}`,
      category: 'privacy',
      kind: 'privacy',
    })
  }

  if (env.CLIENT_SIDE_DEFI_ENABLED && project.defiInfo) {
    results.push({
      ...common,
      href: `/defi/projects/${project.slug}`,
      category: 'defi',
      kind: 'defi',
    })
  }

  return results
}
