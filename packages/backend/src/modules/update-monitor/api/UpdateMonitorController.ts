import { type Project, ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { ConfigReader, ConfigRegistry } from '@l2beat/discovery'
import {
  type DashboardProject,
  getDashboardProjects,
} from './props/getDashboardProjects'
import {
  renderDashboardMarkdown,
  renderProjectMarkdown,
} from './view/DashboardMarkdown'
import { renderDashboardPage } from './view/DashboardPage'

export class UpdateMonitorController {
  private readonly onDiskConfigs: ConfigRegistry[] = []
  private projectConfigs:
    | Project<never, 'scalingInfo' | 'isBridge' | 'isDaLayer'>[]
    | undefined

  constructor(
    private readonly db: Database,
    private readonly configReader: ConfigReader,
    private readonly projectService: ProjectService,
  ) {
    this.onDiskConfigs = this.configReader
      .readAllDiscoveredProjects()
      .map((project) => this.configReader.readConfig(project))
  }

  async getDiscoveryDashboard(selectedEmoji?: string): Promise<string> {
    const { projects, projectConfigs, projectsWithHighSeverityChanges } =
      await this.getDiscoveryDashboardData()
    return renderDashboardPage(
      projects,
      projectConfigs,
      projectsWithHighSeverityChanges,
      selectedEmoji,
    )
  }

  async getDiscoveryDashboardMarkdown(selectedEmoji?: string): Promise<string> {
    const { projects, projectConfigs, projectsWithHighSeverityChanges } =
      await this.getDiscoveryDashboardData()
    return renderDashboardMarkdown(
      projects,
      projectConfigs,
      projectsWithHighSeverityChanges,
      selectedEmoji,
    )
  }

  async getProjectMarkdown(projectName: string): Promise<string | null> {
    const { projects, projectsWithHighSeverityChanges } =
      await this.getDiscoveryDashboardData()
    const project = projects.find((p) => p.name === projectName)
    if (!project) {
      return null
    }
    const hasHighSeverity = projectsWithHighSeverityChanges.has(project.name)
    return renderProjectMarkdown(project, hasHighSeverity)
  }

  async getUpdates() {
    const entries = await this.db.updateMessage.getAll()

    return entries.map((entry) => ({
      ...entry,
      timestamp: entry.timestamp,
    }))
  }

  private async getProjectConfigs() {
    if (this.projectConfigs) return this.projectConfigs

    const ps = new ProjectService()
    this.projectConfigs = await ps.getProjects({
      optional: ['scalingInfo', 'isBridge', 'isDaLayer'],
      whereNot: ['isUpcoming'],
    })

    return this.projectConfigs
  }

  private async getDiscoveryDashboardData(): Promise<{
    projects: DashboardProject[]
    projectConfigs: Project<never, 'scalingInfo' | 'isBridge' | 'isDaLayer'>[]
    projectsWithHighSeverityChanges: Set<string>
  }> {
    const projects: DashboardProject[] = await getDashboardProjects(
      this.onDiskConfigs.filter((config) => !config.archived),
      this.configReader,
      this.db,
      this.projectService,
    )

    const projectConfigs = await this.getProjectConfigs()
    const projectsWithHighSeverityChanges = new Set(
      (await this.db.updateDiff.getAll()).map((diff) => diff.projectId),
    )

    return { projects, projectConfigs, projectsWithHighSeverityChanges }
  }
}
