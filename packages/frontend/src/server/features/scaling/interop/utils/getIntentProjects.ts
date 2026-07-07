import type { Project } from '@l2beat/config'

export function getIntentProjects(projects: Project<'interopConfig'>[]) {
  return projects
    .filter((project) => project.interopConfig.type === 'intent')
    .toSorted((a, b) => a.name.localeCompare(b.name))
}
