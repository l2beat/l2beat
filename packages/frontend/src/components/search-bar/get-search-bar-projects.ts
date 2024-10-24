import {
  type Bridge,
  type DaLayer,
  type Layer2,
  type Layer3,
} from '@l2beat/config'
import {
  resolvedBridges,
  resolvedDaLayers,
  resolvedLayer2s,
  resolvedLayer3s,
} from '@l2beat/config/projects'
import { env } from '~/env'

export interface SearchBarProject {
  id: string
  isUpcoming: boolean
  name: string
  iconUrl: string
  href: string
  matchers: string[]
  createdAt: number
  type: 'layer2' | 'layer3' | 'bridge' | 'da'
}

export function getSearchBarProjects() {
  return toSearchBarProjects([
    ...resolvedLayer2s,
    ...resolvedLayer3s,
    ...resolvedBridges,
    ...(env.NEXT_PUBLIC_FEATURE_FLAG_DA_BEAT ? resolvedDaLayers : []),
  ])
}

function toSearchBarProjects(
  projects: (Layer2 | Layer3 | Bridge | DaLayer)[],
): SearchBarProject[] {
  return projects.flatMap((project): SearchBarProject | SearchBarProject[] => {
    if (project.type === 'DaLayer') {
      return project.bridges.map((bridge) => ({
        id: `${project.id}-${bridge.id}`,
        type: 'da' as const,
        isUpcoming: !!project.isUpcoming,
        name:
          project.kind === 'DAC'
            ? project.display.name
            : `${project.display.name} with ${bridge.display.name}`,
        iconUrl: `/icons/${project.display.slug}.png`,
        href: `/data-availability/projects/${project.display.slug}/${bridge.display.slug}`,
        matchers: [project.display.slug, bridge.display.slug],
        createdAt: bridge.createdAt.toNumber(),
      }))
    }

    return {
      id: project.id,
      type: project.type,
      isUpcoming: !!project.isUpcoming,
      name: project.display.name,
      iconUrl: `/icons/${project.display.slug}.png`,
      href: getHref(project),
      matchers: [project.display.slug],
      createdAt: project.createdAt.toNumber(),
    }
  })
}

function getHref(project: Layer2 | Layer3 | Bridge) {
  if (project.type === 'layer2' || project.type === 'layer3') {
    return `/scaling/projects/${project.display.slug}`
  }
  return `/bridges/projects/${project.display.slug}`
}
