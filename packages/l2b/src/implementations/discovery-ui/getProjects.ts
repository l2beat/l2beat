import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import type { ApiProjectsResponse } from './types'

export function getProjects(configReader: ConfigReader, skipTokens: boolean) {
  const entries = configReader.readAllDiscoveredProjects(
    skipTokens ? { skipGroup: 'tokens' } : {},
  )
  const projectToDiscovery = new Map<string, DiscoveryOutput>()
  for (const entry of entries) {
    projectToDiscovery.set(entry, configReader.readDiscovery(entry))
  }

  const response: ApiProjectsResponse = [...projectToDiscovery.entries()]
    .map(([name, discovery]) => ({
      name,
      addresses: discovery.entries.map((e) => e.address.toLowerCase()),
      contractNames: discovery.entries
        .map((e) => e.name?.toLowerCase())
        .filter((x) => x !== undefined),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return response
}
