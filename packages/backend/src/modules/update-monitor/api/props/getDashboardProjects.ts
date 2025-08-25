import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import {
  type ConfigReader,
  type ConfigRegistry,
  type DiscoveryDiff,
  type DiscoveryOutput,
  diffDiscovery,
} from '@l2beat/discovery'
import { canTrackedTxsBeAffected } from '../../UpdateNotifier'

export interface DashboardProject {
  name: string
  changes: {
    diff?: DiscoveryDiff[]
    trackedTxsAffected?: boolean
  }
  config?: ConfigRegistry
}

export async function getDashboardProjects(
  configs: ConfigRegistry[],
  configReader: ConfigReader,
  db: Database,
  projectService: ProjectService,
): Promise<DashboardProject[]> {
  const projects: DashboardProject[] = []
  for (const config of configs) {
    const discovery = configReader.readDiscovery(config.name)
    const diff: DiscoveryDiff[] = await getDiff(db, discovery)
    const trackedTxsAffected = await canTrackedTxsBeAffected(
      projectService,
      config.name,
      diff,
    )

    const project: DashboardProject = {
      name: config.name,
      changes: {
        diff,
        trackedTxsAffected,
      },
      config: config,
    }

    projects.push(project)
  }
  return projects.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getDiff(
  db: Database,
  discovery: DiscoveryOutput,
): Promise<DiscoveryDiff[]> {
  const latest = await db.updateMonitor.findLatest(discovery.name)

  let diff: DiscoveryDiff[] = []
  if (latest?.discovery.entries) {
    diff = diffDiscovery(discovery.entries, latest.discovery.entries)
  }
  return diff
}
