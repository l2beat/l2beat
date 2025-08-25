import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { ConfigReader, ConfigRegistry } from '@l2beat/discovery'
import {
  type DashboardProject,
  getDashboardProjects,
} from './props/getDashboardProjects'
import { renderDashboardPage } from './view/DashboardPage'

export class UpdateMonitorController {
  private readonly onDiskConfigs: ConfigRegistry[] = []

  constructor(
    private readonly db: Database,
    private readonly configReader: ConfigReader,
    private readonly projectService: ProjectService,
  ) {
    this.onDiskConfigs = this.configReader
      .readAllDiscoveredProjects()
      .map((project) => this.configReader.readConfig(project))
  }

  async getDiscoveryDashboard(): Promise<string> {
    const projects: DashboardProject[] = await getDashboardProjects(
      this.onDiskConfigs.filter((config) => !config.archived),
      this.configReader,
      this.db,
      this.projectService,
    )

    return renderDashboardPage({ projects })
  }

  async getUpdates() {
    const entries = await this.db.updateMessage.getAll()

    return entries.map((entry) => ({
      ...entry,
      timestamp: entry.timestamp,
    }))
  }
}
