import type { Database } from '@l2beat/database'
import type {
  ConfigReader,
  DiscoveryConfig,
  DiscoveryDiff,
} from '@l2beat/discovery'
import { getDiff } from './utils/getDiff'

export interface DashboardProject {
  name: string
  diff?: DiscoveryDiff[]
  config?: DiscoveryConfig
}

export async function getDashboardProjects(
  configs: DiscoveryConfig[],
  configReader: ConfigReader,
  db: Database,
  chain: string,
  chainId: number,
): Promise<DashboardProject[]> {
  const projects: DashboardProject[] = []
  for (const config of configs) {
    const discovery = configReader.readDiscovery(config.name, chain)
    const diff: DiscoveryDiff[] = await getDiff(db, discovery, chainId)

    const project: DashboardProject = {
      name: config.name,
      diff,
      config: config,
    }

    projects.push(project)
  }
  return projects.sort((a, b) => a.name.localeCompare(b.name))
}
