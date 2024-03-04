import { Project } from './types'

export function getChainNames(projects: Project[]): string[] {
  return projects
    .flatMap(getProjectChainNames)
    .filter((x, i, a) => a.indexOf(x) === i)
}

function getProjectChainNames(project: Project): string[] {
  return project.contracts?.addresses.map((c) => c.chain ?? 'ethereum') ?? []
}
