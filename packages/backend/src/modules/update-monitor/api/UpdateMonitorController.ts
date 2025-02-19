import type { BackendProject } from '@l2beat/backend-shared'
import type { Database } from '@l2beat/database'
import type {
  ConfigReader,
  DiscoveryChainConfig,
  DiscoveryConfig,
  DiscoveryDiff,
} from '@l2beat/discovery'
import type { ChainConverter } from '@l2beat/shared-pure'
import { getDashboardContracts } from './props/getDashboardContracts'
import {
  type DashboardProject,
  getDashboardProjects,
} from './props/getDashboardProjects'
import { getDiff } from './props/utils/getDiff'
import { renderDashboardPage } from './view/DashboardPage'
import { renderDashboardProjectPage } from './view/DashboardProjectPage'

export class UpdateMonitorController {
  private readonly onDiskConfigs: Record<string, DiscoveryConfig[]> = {}

  constructor(
    private readonly db: Database,
    private readonly projects: BackendProject[],
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
      const projectsToFill = chain.name === 'ethereum' ? this.projects : []
      projects[chain.name] = await getDashboardProjects(
        projectsToFill,
        this.onDiskConfigs[chain.name],
        this.configReader,
        this.db,
        chain.name,
        this.chainConverter.toChainId(chain.name),
      )
    }

    return renderDashboardPage({ projects })
  }

  async getDiscoveryDashboardProject(
    project: string,
    chain: string,
  ): Promise<string> {
    const discovery = this.configReader.readDiscovery(project, chain)
    const config = this.configReader.readConfig(project, chain)
    const contracts = getDashboardContracts(discovery, config)

    const diff: DiscoveryDiff[] = await getDiff(
      this.db,
      discovery,
      this.chainConverter.toChainId(chain),
    )

    return renderDashboardProjectPage({
      chain,
      projectName: project,
      contracts,
      diff,
      config,
    })
  }

  async getUpdates() {
    const entries = await this.db.updateMessage.getAll()

    return entries.map((entry) => ({
      ...entry,
      timestamp: entry.timestamp.toNumber(),
    }))
  }
}
