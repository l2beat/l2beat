import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import type { ApiProjectsResponse } from './types'

export function getProjects(configReader: ConfigReader) {
  const chains = configReader.readAllChains()
  const projectToDiscovery = new Map<string, DiscoveryOutput[]>()
  for (const chain of chains) {
    const projects = configReader.readAllProjectsForChain(chain)
    for (const project of projects) {
      const projectChains = projectToDiscovery.get(project) ?? []
      projectChains.push(configReader.readDiscovery(project, chain))
      projectToDiscovery.set(project, projectChains)
    }
  }

  const response: ApiProjectsResponse = [...projectToDiscovery.entries()]
    .map(([name, discoveries]) => ({
      name,
      addresses: discoveries.flatMap((x) =>
        x.entries.map((e) => e.address.toLowerCase()),
      ),
      contractNames: discoveries.flatMap((x) =>
        x.entries
          .map((e) => e.name?.toLowerCase())
          .filter((x) => x !== undefined),
      ),
      chains: discoveries.map((x) => x.chain),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return response
}
