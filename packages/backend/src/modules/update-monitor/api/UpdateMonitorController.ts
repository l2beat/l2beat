import type { Database } from '@l2beat/database'
import type {
  ConfigReader,
  DiscoveryChainConfig,
  DiscoveryConfig,
} from '@l2beat/discovery'
import type { ChainConverter } from '@l2beat/shared-pure'
import {
  type DashboardProject,
  getDashboardProjects,
} from './props/getDashboardProjects'
import { renderDashboardPage } from './view/DashboardPage'

export class UpdateMonitorController {
  private readonly onDiskConfigs: Record<string, DiscoveryConfig[]> = {}

  constructor(
    private readonly db: Database,
    private readonly chains: DiscoveryChainConfig[],
    private readonly configReader: ConfigReader,
    private readonly chainConverter: ChainConverter,
  ) {
    for (const chain of chains) {
      this.onDiskConfigs[chain.name] = this.configReader.readAllConfigsForChain(
        chain.name,
      )
    }
  }

  async getDiscoveryDashboard(): Promise<string> {
    console.log(this.chains.map((c) => c.name))

    const projects: Record<string, DashboardProject[]> = {}
    for (const chain of this.chains) {
      projects[chain.name] = await getDashboardProjects(
        this.onDiskConfigs[chain.name],
        this.configReader,
        this.db,
        chain.name,
        this.chainConverter.toChainId(chain.name),
      )
    }

    return renderDashboardPage({ projects })
  }

  async getUpdates() {
    const entries = await this.db.updateMessage.getAll()

    return entries.map((entry) => ({
      ...entry,
      timestamp: entry.timestamp.toNumber(),
    }))
  }
}
