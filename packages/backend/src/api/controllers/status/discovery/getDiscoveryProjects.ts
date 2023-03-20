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
      watchedCount: 0,
      ignoredInWatchModeCount: 0,
      ignoredCount: 0,
      notHandledCount: 0,
      unverifiedCount: config.filter((c) => c.isUnverified).length,
    }

    projects.push(project)
  }

  return projects
}
