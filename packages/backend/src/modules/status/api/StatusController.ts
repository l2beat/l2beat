import { ConfigReader, DiscoveryDiff } from '@l2beat/discovery'

import { Project } from '../../../model/Project'
import { IndexerStateRepository } from '../../../peripherals/database/repositories/IndexerStateRepository'
import { ChainConverter } from '../../../tools/ChainConverter'
import { Clock } from '../../../tools/Clock'
import { LivenessConfigurationRepository } from '../../liveness/repositories/LivenessConfigurationRepository'
import { UpdateMonitorRepository } from '../../update-monitor/repositories/UpdateMonitorRepository'
import { getDashboardContracts } from './discovery/props/getDashboardContracts'
import {
  DashboardProject,
  getDashboardProjects,
} from './discovery/props/getDashboardProjects'
import { getDiff } from './discovery/props/utils/getDiff'
import { renderDashboardPage } from './discovery/view/DashboardPage'
import { renderDashboardProjectPage } from './discovery/view/DashboardProjectPage'
import {
  LivenessStatusPageProps,
  renderLivenessStatusPage,
} from './view/LivenessStatusPage'
import { renderStatusPagesLinksPage } from './view/StatusPagesLinksPage'

export class StatusController {
  constructor(
    private readonly updateMonitorRepository: UpdateMonitorRepository,
    private readonly clock: Clock,
    private readonly projects: Project[],
    private readonly configReader: ConfigReader,
    private readonly indexerStateRepository: IndexerStateRepository,
    private readonly livenessConfigurationRepository: LivenessConfigurationRepository,
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

  async getLivenessStatus() {
    const indexerState = await this.indexerStateRepository.findIndexerState(
      'liveness_indexer',
    )
    const targetTimestamp = this.clock.getLastHour()

    const configurations = await this.livenessConfigurationRepository.getAll()
    const unusedConfigurationsIds =
      await this.livenessConfigurationRepository.findUnusedConfigurationsIds()

    const params: LivenessStatusPageProps = {
      indexerState,
      targetTimestamp,
      configurations,
      unusedConfigurationsIds,
    }
    return renderLivenessStatusPage(params)
  }

  getStatusPagesLinks() {
    return renderStatusPagesLinksPage()
  }
}
