import {
  type Bridge,
  type DaLayer,
  type Layer2,
  type Layer3,
  type ZkCatalogProject,
  bridges,
  daLayers,
  layer2s,
  layer3s,
  zkCatalogProjects,
} from '@l2beat/config'
import { type SearchBarProject } from './search-bar-entry'

export const searchBarProjects = toSearchBarProjects([
  ...layer2s,
  ...layer3s,
  ...bridges,
  ...daLayers,
  ...zkCatalogProjects,
])

function toSearchBarProjects(
  projects: (Layer2 | Layer3 | Bridge | DaLayer | ZkCatalogProject)[],
): SearchBarProject[] {
  return projects.flatMap((project): SearchBarProject | SearchBarProject[] => {
    if (project.type === 'DaLayer') {
      return project.bridges.map((bridge) => ({
        type: 'project',
        id: `${project.id}-${bridge.id}`,
        category: 'da',
        kind: 'da',
        isUpcoming: !!project.isUpcoming,
        name:
          project.kind === 'DAC'
            ? project.display.name
            : `${project.display.name} with ${bridge.display.name}`,
        iconUrl: `/icons/${project.display.slug}.png`,
        href: `/data-availability/projects/${project.display.slug}/${bridge.display.slug}`,
        tags: [project.display.slug, bridge.display.slug],
        createdAt: bridge.createdAt.toNumber(),
      }))
    }

    if (project.type === 'zk-catalog') {
      return {
        type: 'project',
        id: `zk-catalog-${project.display.slug}`,
        category: 'zkCatalog',
        kind: 'zkCatalog',
        isUpcoming: false,
        name: project.display.name,
        iconUrl: `/icons/${project.display.slug}.png`,
        href: `/zk-catalog/${project.display.slug}`,
        tags: [project.display.slug],
        createdAt: project.createdAt.toNumber(),
      }
    }

    const common = {
      type: 'project',
      id: project.id,
      category: project.type === 'bridge' ? 'bridges' : 'scaling',
      kind: project.type,
      isUpcoming: !!project.isUpcoming,
      name: project.display.name,
      iconUrl: `/icons/${project.display.slug}.png`,
      href: getHref(project),
      tags: [project.display.slug],
      createdAt: project.createdAt.toNumber(),
    } satisfies SearchBarProject

    if (project.type === 'bridge') {
      return common
    }

    return [
      common,
      ...(project.stateValidation?.proofVerification && !project.isUpcoming
        ? [
            {
              ...common,
              id: `zk-catalog-${project.id}`,
              category: 'zkCatalog' as const,
              href: `/zk-catalog/${project.display.slug}`,
            },
          ]
        : []),
    ]
  })
}

function getHref(project: Layer2 | Layer3 | Bridge) {
  if (project.type === 'layer2' || project.type === 'layer3') {
    return `/scaling/projects/${project.display.slug}`
  }
  return `/bridges/projects/${project.display.slug}`
}
