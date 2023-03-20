import { ConfigReader } from '../../../../core/discovery/ConfigReader'
import { DashboardProject } from '../view/discovery/DashboardPage'
import { getDiscoveryConfig } from './getDiscoveryConfig'

export async function getDiscoveryProjects(): Promise<DashboardProject[]> {
  const configReader = new ConfigReader()
  const names = (await configReader.readAllConfigs()).map((c) => c.name)

  const projects: DashboardProject[] = []

  for (const name of names) {
    const config = await getDiscoveryConfig(name)

    const project: DashboardProject = {
      name,
      discoveredCount: config.length,
      initialAddressesCount: config.filter((c) => c.isInitial).length,
      watchedCount: config
        .map((c) => c.watched?.length ?? 0)
        .reduce((a, b) => a + b, 0),
      ignoredInWatchModeCount: config
        .map((c) => c.ignoreInWatchMode?.length ?? 0)
        .reduce((a, b) => a + b, 0),
      ignoredCount: config
        .map((c) => c.ignoreMethods?.length ?? 0)
        .reduce((a, b) => a + b, 0),
      notHandledCount: config
        .map((c) => c.notHandled?.length ?? 0)
        .reduce((a, b) => a + b, 0),
      unverifiedCount:
        config.filter((c) => c.isUnverified).length > 0
          ? config.filter((c) => c.isUnverified).length
          : undefined,
    }

    projects.push(project)
  }

  return projects
}
