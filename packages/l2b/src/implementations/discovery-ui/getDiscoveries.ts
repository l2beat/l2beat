import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'

export function getProjectDiscoveries(
  configReader: ConfigReader,
  project: string,
  chain: string,
): DiscoveryOutput[] {
  const baseDiscovery = configReader.readDiscovery(project, chain)
  const discoveries = [baseDiscovery]
  for (const sharedModule of baseDiscovery.sharedModules ?? []) {
    discoveries.push(configReader.readDiscovery(sharedModule, chain))
  }

  return discoveries
}
