import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import { getReferencedProjects } from './getReferencedProjects'

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
