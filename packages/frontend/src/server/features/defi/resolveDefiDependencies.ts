import type { ProjectExternalDependency } from '@l2beat/config'
import { manifest } from '~/utils/Manifest'

export interface DefiDependencyProject {
  name: string
  slug: string
  isDefi: boolean
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
        icon: manifest.getUrl(`/icons/${dependency.projectId}.png`),
        description: dependency.description,
        reviewed: true,
      }
    }

    return {
      name: project.name,
      icon: manifest.getUrl(`/icons/${project.slug}.png`),
      description: dependency.description,
      ...(project.isDefi ? { href: `/defi/projects/${project.slug}` } : {}),
      reviewed: true,
    }
  })
}
