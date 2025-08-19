import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import type { ApiProjectsResponse } from './types'

export function getProjects(configReader: ConfigReader, skipTokens: boolean) {
  const entries = configReader.readAllDiscoveredProjects(
    skipTokens ? { skipGroup: 'tokens' } : {},
  )
  const projectToDiscovery = new Map<string, DiscoveryOutput[]>()
  for (const entry of entries) {
    projectToDiscovery.set(
      entry.project,
      entry.chains.map((chain) =>
        configReader.readDiscovery(entry.project, chain),
      ),
    )
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
