import { getProjectDevIds } from '../../src'
import { Project } from './types'

export function getChainNames(projects: Project[]): string[] {
  return projects
    .flatMap(getProjectDevIds)
    .filter((x, i, a) => a.indexOf(x) === i)
}
