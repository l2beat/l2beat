import path from 'path'
import { ConfigReader } from '@l2beat/discovery'
import type { DiscoveryOutput } from '@l2beat/discovery-types'

export function getOnDiskData() {
  const configReader = new ConfigReader(path.join(process.cwd(), '../config'))
  const chains = configReader.readAllChains()
  const projects: Record<string, string[]> = {}
  const discoveries: Record<string, Record<string, DiscoveryOutput>> = {}

  for (const chain of chains) {
    const chainProjects = configReader.readAllProjectsForChain(chain)
    projects[chain] = chainProjects

    for (const project of chainProjects) {
      const discovery = configReader.readDiscovery(project, chain)
      const onDiskDiscovery = discoveries[chain] ?? {}
      onDiskDiscovery[project] = discovery
      discoveries[chain] = onDiskDiscovery
    }
  }

  return { chains, projects, discoveries }
}
