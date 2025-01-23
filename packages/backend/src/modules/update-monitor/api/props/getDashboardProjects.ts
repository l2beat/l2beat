import type { BackendProject } from '@l2beat/backend-shared'
import type { Database } from '@l2beat/database'
import type {
  ConfigReader,
  DiscoveryConfig,
  DiscoveryDiff,
} from '@l2beat/discovery'
import type { ChainId } from '@l2beat/shared-pure'
import { getDiff } from './utils/getDiff'

export interface DashboardProject {
  name: string
  configured: boolean
  diff?: DiscoveryDiff[]
  config?: DiscoveryConfig
}

export async function getDashboardProjects(
  projects: BackendProject[],
  configs: DiscoveryConfig[],
  configReader: ConfigReader,
  db: Database,
  chain: string,
  chainId: ChainId,
): Promise<DashboardProject[]> {
  const configuredProjects: DashboardProject[] = []

  for (const config of configs) {
    const discovery = configReader.readDiscovery(config.name, chain)
    const diff: DiscoveryDiff[] = await getDiff(db, discovery, chainId)

    const project: DashboardProject = {
      name: config.name,
      configured: true,
      diff,
      config: config,
    }

    configuredProjects.push(project)
  }

  const projectsList = projects.map((p) => p.projectId.toString())
  const result = configuredProjects
    .concat(
      projectsList
        .filter(
          (project) => !configuredProjects.map((x) => x.name).includes(project),
        )
        .map((p) => ({ name: p, configured: false })),
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  return result
}
