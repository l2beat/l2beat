import type { ProjectExternalDependency } from '@l2beat/config'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getProjectUrl } from '~/utils/project/getProjectUrl'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'

export interface DefiDependencyProject {
  name: string
  slug: string
  href?: string
}

export interface DefiDependency {
  name: string
  icon: string
  description: string
  href?: string
  reviewed: boolean
}

export async function getDefiDependencyProjectsById(
  dependencies: ProjectExternalDependency[] | undefined,
): Promise<Map<string, DefiDependencyProject>> {
  const trackedIds = [
    ...new Set(
      (dependencies ?? [])
        .filter((dependency) => dependency.type === 'tracked')
        .map((dependency) => dependency.projectId),
    ),
  ]

  if (trackedIds.length === 0) {
    return new Map()
  }

  const [projects, daLayers] = await Promise.all([
    ps.getProjects({
      ids: trackedIds,
      optional: ['defiInfo', 'privacyInfo', 'daBridge', 'daLayer'],
    }),
    ps.getProjects({ where: ['daLayer'] }),
  ])

  return new Map(
    projects.map((project) => [
      project.id,
      {
        name: project.name,
        slug: project.slug,
        href: getProjectUrl(project, daLayers),
      },
    ]),
  )
}

export interface DefiDependencyProject {
  name: string
  slug: string
  href?: string
}

export interface DefiDependency {
  name: string
  icon: string
  description: string
  href?: string
  reviewed: boolean
}

export function resolveDefiDependencies(
  dependencies: ProjectExternalDependency[],
  projectsById: ReadonlyMap<string, DefiDependencyProject>,
): DefiDependency[] {
  return dependencies.map((dependency) => {
    if (dependency.type === 'not-tracked') {
      return {
        name: dependency.name,
        icon: manifest.getUrl(`/icons/${dependency.icon}.png`),
        description: dependency.description,
        reviewed: false,
      }
    }

    const project = projectsById.get(dependency.projectId)
    if (!project) {
      return {
        name: dependency.projectId,
        icon: TOKEN_PLACEHOLDER_ICON_URL,
        description: dependency.description,
        reviewed: true,
      }
    }

    return {
      name: project.name,
      icon: manifest.getUrl(`/icons/${project.slug}.png`),
      description: dependency.description,
      ...(project.href ? { href: project.href } : {}),
      reviewed: true,
    }
  })
}
