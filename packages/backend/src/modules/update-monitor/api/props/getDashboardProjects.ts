import { ConfigReader, DiscoveryConfig, DiscoveryDiff } from '@l2beat/discovery'
import { ChainId } from '@l2beat/shared-pure'

import { Project } from '../../../../model/Project'
import { UpdateMonitorRepository } from '../../repositories/UpdateMonitorRepository'
import { getDiff } from './utils/getDiff'

export interface DashboardProject {
  name: string
  configured: boolean
  diff?: DiscoveryDiff[]
  config?: DiscoveryConfig
}

export async function getDashboardProjects(
  projects: Project[],
  configs: DiscoveryConfig[],
  configReader: ConfigReader,
  updateMonitorRepository: UpdateMonitorRepository,
  chain: string,
  chainId: ChainId,
): Promise<DashboardProject[]> {
  const configuredProjects: DashboardProject[] = []

  for (const config of configs) {
    const discovery = configReader.readDiscovery(config.name, chain)
    const diff: DiscoveryDiff[] = await getDiff(
      updateMonitorRepository,
      discovery,
      config,
      chainId,
    )

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
