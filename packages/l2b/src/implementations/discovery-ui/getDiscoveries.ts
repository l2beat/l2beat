import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import { notUndefined } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'

export function getProjectDiscoveries(
  configReader: ConfigReader,
  project: string,
): DiscoveryOutput[] {
  const baseDiscovery = configReader.readDiscovery(project)
  const discoveries = [baseDiscovery]
  const referencedProjects = uniq(
    baseDiscovery.entries
      .map((e) => e.targetProject)
      .filter(notUndefined)
      .sort(),
  )
  for (const refProject of referencedProjects) {
    discoveries.push(configReader.readDiscovery(refProject))
  }

  return discoveries
}

export function getAllProjectDiscoveries(
  configReader: ConfigReader,
  project: string,
): DiscoveryOutput[] {
  return getProjectDiscoveries(configReader, project)
}
