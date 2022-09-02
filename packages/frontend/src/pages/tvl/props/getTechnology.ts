import { Project } from '@l2beat/config'

export function getTechnology(project: Project) {
  const name = project.details.technology.category.name
  // TODO: refactor and remove abbreviation
  return { abbreviation: '-', name }
}
