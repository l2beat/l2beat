import type { ProjectExternalDependency } from '@l2beat/config'
import { manifest } from '~/utils/Manifest'

export interface DefiDependency {
  name: string
  icon: string
  description: string
  href?: string
}

export function resolveDefiDependencies(
  dependencies: ProjectExternalDependency[],
  defiProjectsById: ReadonlyMap<string, { name: string; slug: string }>,
): DefiDependency[] {
  return dependencies.map((dependency) => {
    if (dependency.type === 'not-tracked') {
      return {
        name: dependency.name,
        icon: manifest.getUrl(`/icons/${dependency.icon}.png`),
        description: dependency.description,
      }
    }

    const project = defiProjectsById.get(dependency.projectId)
    if (!project) {
      return {
        name: dependency.projectId,
        icon: manifest.getUrl(`/icons/${dependency.projectId}.png`),
        description: dependency.description,
      }
    }

    return {
      name: project.name,
      icon: manifest.getUrl(`/icons/${project.slug}.png`),
      description: dependency.description,
      href: `/defi/projects/${project.slug}`,
    }
  })
}
