import path from 'path'
import { ConfigReader, type DiscoveryOutput } from '@l2beat/discovery'

export function getOnDiskData() {
  const configReader = new ConfigReader(
    // TODO: This is the only place we are not using getDiscoveryPaths()
    // This feature is architected incorrectly and instead we should save
    // the info about implementation/highSeverityField change in the db directly
    path.join(process.cwd(), '../config/src/projects'),
  )
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
