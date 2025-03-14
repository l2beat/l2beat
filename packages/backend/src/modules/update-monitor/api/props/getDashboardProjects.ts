import type { Database } from '@l2beat/database'
import {
  type ConfigReader,
  type DiscoveryConfig,
  type DiscoveryDiff,
  type DiscoveryOutput,
  diffDiscovery,
} from '@l2beat/discovery'
import { ChainId } from '@l2beat/shared-pure'

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

export async function getDiff(
  db: Database,
  discovery: DiscoveryOutput,
  chainId: number,
): Promise<DiscoveryDiff[]> {
  const latest = await db.updateMonitor.findLatest(
    discovery.name,
    ChainId(chainId),
  )

  let diff: DiscoveryDiff[] = []
  if (latest?.discovery.entries) {
    diff = diffDiscovery(discovery.entries, latest.discovery.entries)
  }
  return diff
}
