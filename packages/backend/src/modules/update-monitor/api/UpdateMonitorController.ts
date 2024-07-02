import { ConfigReader, DiscoveryConfig } from '@l2beat/discovery'
import { ChainConverter, DiscoveryDiff } from '@l2beat/shared-pure'

import { UpdateMonitorRepository } from '../repositories/UpdateMonitorRepository'
import { getDashboardContracts } from './props/getDashboardContracts'
import {
  DashboardProject,
  getDashboardProjects,
} from './props/getDashboardProjects'
import { getDiff } from './props/utils/getDiff'
import { renderDashboardPage } from './view/DashboardPage'
import { renderDashboardProjectPage } from './view/DashboardProjectPage'
import { BackendProject } from '@l2beat/config'

export class UpdateMonitorController {
  private readonly onDiskChains: string[] = []
  private readonly onDiskConfigs: Record<string, DiscoveryConfig[]> = {}

  constructor(
    private readonly updateMonitorRepository: UpdateMonitorRepository,
    private readonly projects: BackendProject[],
    private readonly configReader: ConfigReader,
    private readonly chainConverter: ChainConverter,
  ) {
    this.onDiskChains = this.configReader.readAllChains()
    for (const chain of this.onDiskChains) {
      this.onDiskConfigs[chain] =
        this.configReader.readAllConfigsForChain(chain)
    }
  }

  async getDiscoveryDashboard(): Promise<string> {
    const projects: Record<string, DashboardProject[]> = {}
    for (const chain of this.onDiskChains) {
      const projectsToFill = chain === 'ethereum' ? this.projects : []
      projects[chain] = await getDashboardProjects(
        projectsToFill,
        this.onDiskConfigs[chain],
        this.configReader,
        this.updateMonitorRepository,
        chain,
        this.chainConverter.toChainId(chain),
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
      this.updateMonitorRepository,
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
}
