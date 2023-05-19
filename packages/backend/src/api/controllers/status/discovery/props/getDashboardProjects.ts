import { ConfigReader, DiscoveryDiff } from '@l2beat/discovery'

import { UpdateMonitorRepository } from '../../../../../peripherals/database/discovery/UpdateMonitorRepository'
import { getDashboardContracts } from './getDashboardContracts'
import { getDiff } from './utils/getDiff'

export interface DashboardProject {
  name: string
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
  configReader: ConfigReader,
  updateMonitorRepository: UpdateMonitorRepository,
): Promise<DashboardProject[]> {
  const names = (await configReader.readAllConfigs()).map((c) => c.name)

  const projects: DashboardProject[] = []

  for (const name of names) {
    const config = await configReader.readConfig(name)
    const discovery = await configReader.readDiscovery(name)
    const diff: DiscoveryDiff[] = await getDiff(
      updateMonitorRepository,
      discovery,
      config,
    )
    const contracts = getDashboardContracts(discovery, config)

    const project: DashboardProject = {
      name,
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

    projects.push(project)
  }

  return projects
}
