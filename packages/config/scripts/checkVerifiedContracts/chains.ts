import { Project } from './types'

export function getChainDevIds(projects: Project[]): string[] {
  return projects
    .flatMap(getProjectDevIds)
    .filter((x, i, a) => a.indexOf(x) === i)
}

function getProjectDevIds(project: Project): string[] {
  const devIds =
    project.contracts?.addresses.map(
      (contract) => contract.devId ?? 'ethereum',
    ) ?? []

  return devIds
}
