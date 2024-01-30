import { ConfigReader, DiscoveryDiff } from '@l2beat/discovery'
import { ChainId } from '@l2beat/shared-pure'

import { Project } from '../../../../../model'
import { UpdateMonitorRepository } from '../../../../../peripherals/database/discovery/UpdateMonitorRepository'
import { getDashboardContracts } from './getDashboardContracts'
import { getDiff } from './utils/getDiff'

export interface DashboardProject {
  name: string
  configured: boolean
  diff?: DiscoveryDiff[]
  discoveredCount?: number
  initialAddressesCount?: number
  watchedCount?: number
  ignoredInWatchModeCount?: number
  ignoredCount?: number
  notHandledCount?: number
  unverifiedCount?: number
}

export async function getDashboardProjects(
  projects: Project[],
  configReader: ConfigReader,
  updateMonitorRepository: UpdateMonitorRepository,
  chain: string,
  chainId: ChainId,
): Promise<DashboardProject[]> {
  const configs = await configReader.readAllConfigsForChain(chain)

  const configuredProjects: DashboardProject[] = []

  for (const config of configs) {
    const discovery = await configReader.readDiscovery(config.name, chain)
    const diff: DiscoveryDiff[] = await getDiff(
      updateMonitorRepository,
      discovery,
      config,
      chainId,
    )
    const contracts = getDashboardContracts(discovery, config)

    const project: DashboardProject = {
      name: config.name,
      configured: true,
      diff,
      discoveredCount: contracts.length,
      initialAddressesCount: contracts.filter((c) => c.isInitial).length,
      watchedCount: contracts
        .map((c) => c.watched?.length ?? 0)
        .reduce((a, b) => a + b, 0),
      ignoredInWatchModeCount: contracts
        .map((c) => c.ignoreInWatchMode?.length ?? 0)
        .reduce((a, b) => a + b, 0),
      ignoredCount: contracts
        .map((c) => c.ignoreMethods?.length ?? 0)
        .reduce((a, b) => a + b, 0),
      notHandledCount: contracts
        .map((c) => c.notHandled?.length ?? 0)
        .reduce((a, b) => a + b, 0),
      unverifiedCount:
        contracts.filter((c) => c.isUnverified).length > 0
          ? contracts.filter((c) => c.isUnverified).length
          : undefined,
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
