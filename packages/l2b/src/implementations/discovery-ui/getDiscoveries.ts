import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import { getReferencedProjects } from './utils'

export function getProjectDiscoveries(
  configReader: ConfigReader,
  project: string,
): DiscoveryOutput[] {
  const baseDiscovery = configReader.readDiscovery(project)
  const discoveries = [baseDiscovery]
  const referencedProjects = getReferencedProjects(baseDiscovery)

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
