import { ConfigReader } from '@l2beat/discovery'
import { DiscoveryDiff } from '@l2beat/shared-pure'

import { Project } from '../../../model/Project'
import { ChainConverter } from '../../../tools/ChainConverter'
import { getDashboardContracts } from '../../status/api/discovery/props/getDashboardContracts'
import {
  DashboardProject,
  getDashboardProjects,
} from '../../status/api/discovery/props/getDashboardProjects'
import { getDiff } from '../../status/api/discovery/props/utils/getDiff'
import { renderDashboardPage } from '../../status/api/discovery/view/DashboardPage'
import { renderDashboardProjectPage } from '../../status/api/discovery/view/DashboardProjectPage'
import { UpdateMonitorRepository } from '../repositories/UpdateMonitorRepository'

export class UpdateMonitorController {
  constructor(
    private readonly updateMonitorRepository: UpdateMonitorRepository,
    private readonly projects: Project[],
    private readonly configReader: ConfigReader,
    private readonly chainConverter: ChainConverter,
  ) {}

  async getDiscoveryDashboard(): Promise<string> {
    const projects: Record<string, DashboardProject[]> = {}
    const chains = this.configReader.readAllChains()
    for (const chain of chains) {
      const projectsToFill = chain === 'ethereum' ? this.projects : []
      projects[chain] = await getDashboardProjects(
        projectsToFill,
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
    const discovery = await this.configReader.readDiscovery(project, chain)
    const config = await this.configReader.readConfig(project, chain)
    const contracts = getDashboardContracts(discovery, config)

    const diff: DiscoveryDiff[] = await getDiff(
      this.updateMonitorRepository,
      discovery,
      config,
      this.chainConverter.toChainId(chain),
    )

    return renderDashboardProjectPage({
      chain,
      projectName: project,
      contracts,
      diff,
    })
  }
}
