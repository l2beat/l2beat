import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'

export function getProjectDiscoveries(
  configReader: ConfigReader,
  project: string,
): DiscoveryOutput[] {
  const baseDiscovery = configReader.readDiscovery(project)
  const discoveries = [baseDiscovery]
  for (const sharedModule of baseDiscovery.sharedModules ?? []) {
    discoveries.push(configReader.readDiscovery(sharedModule))
  }

  return discoveries
}

export function getAllProjectDiscoveries(
  configReader: ConfigReader,
  project: string,
): DiscoveryOutput[] {
  return getProjectDiscoveries(configReader, project)
}
