import { Layer2 } from '@l2beat/config'

export function getTechnology(project: Layer2) {
  const name = project.details.technology.category.name
  // TODO: refactor and remove abbreviation
  return { abbreviation: '-', name }
}
