import { projects } from '@l2beat/config'

export function getProjects() {
  return projects.map(({ name }) => name.toLowerCase())
}
