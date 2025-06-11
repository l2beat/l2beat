import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type {
  ConfigReader,
  ConfigRegistry,
  DiscoveryChainConfig,
} from '@l2beat/discovery'
import type { ChainConverter } from '@l2beat/shared-pure'
import {
  type DashboardProject,
  getDashboardProjects,
} from './props/getDashboardProjects'
import { renderDashboardPage } from './view/DashboardPage'

export class UpdateMonitorController {
  private readonly onDiskConfigs: Record<string, ConfigRegistry[]> = {}

  constructor(
    private readonly db: Database,
    private readonly chains: DiscoveryChainConfig[],
    private readonly configReader: ConfigReader,
    private readonly chainConverter: ChainConverter,
    private readonly projectService: ProjectService,
  ) {
    for (const chain of chains) {
      this.onDiskConfigs[chain.name] =
        this.configReader.readAllDiscoveredConfigsForChain(chain.name)
    }
  }

  async getDiscoveryDashboard(): Promise<string> {
    const projects: Record<string, DashboardProject[]> = {}
    for (const chain of this.chains) {
      projects[chain.name] = await getDashboardProjects(
        this.onDiskConfigs[chain.name].filter((config) => !config.archived),
        this.configReader,
        this.db,
        chain.name,
        this.chainConverter.toChainId(chain.name),
        this.projectService,
      )
    }

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
