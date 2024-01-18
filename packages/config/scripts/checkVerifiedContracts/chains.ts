import { Bridge, Layer2 } from '../../src'

export function getChainDevIds(projects: (Layer2 | Bridge)[]): string[] {
  return projects
    .flatMap(getProjectDevIds)
    .filter((x, i, a) => a.indexOf(x) === i)
}

function getProjectDevIds(project: Layer2 | Bridge): string[] {
  const devIds =
    project.contracts?.addresses.map(
      (contract) => contract.devId ?? 'ethereum',
    ) ?? []

  return devIds
}
