import { tokenList } from '@l2beat/config'
import { ConfigReader, DiscoveryDiff } from '@l2beat/discovery'
import {
  ChainId,
  getHourlyTimestamps,
  Hash256,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import { Project } from '../../../model'
import { IndexerStateRepository } from '../../../peripherals/database/repositories/IndexerStateRepository'
import { ChainConverter } from '../../../tools/ChainConverter'
import { Clock } from '../../../tools/Clock'
import { LivenessConfigurationRepository } from '../../liveness/repositories/LivenessConfigurationRepository'
import { BalanceStatusRecord } from '../../tvl/repositories/BalanceStatusRepository'
import { ReportStatusRecord } from '../../tvl/repositories/ReportStatusRepository'
import { TotalSupplyStatusRepository } from '../../tvl/repositories/TotalSupplyStatusRepository'
import { getTotalSupplyConfigHash } from '../../tvl/totalSupply/getTotalSupplyConfigHash'
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
import { renderStatusPage } from './view/StatusPage'
import { renderStatusPagesLinksPage } from './view/StatusPagesLinksPage'

// TODO: make it work correctly after "formula" refactor
export class StatusController {
  constructor(
    private readonly totalSupplyStatusRepository: TotalSupplyStatusRepository,
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
      projectName: project,
      contracts,
      diff,
    })
  }

  async getTotalSuppliesStatus(
    chainId: ChainId = ChainId.ARBITRUM,
    from: UnixTime | undefined,
    to: UnixTime | undefined,
  ): Promise<string> {
    const firstHour = this.getFirstHour(from)
    const lastHour = to ? to : this.clock.getLastHour()

    const timestamps = getHourlyTimestamps(firstHour, lastHour).reverse()

    const statuses = await this.totalSupplyStatusRepository.getBetween(
      chainId,
      firstHour,
      lastHour,
    )
    const config: Token[] = []
    const tokens = tokenList.filter(
      (t) => t.formula === 'totalSupply' && t.chainId === chainId,
    )
    config.push(...tokens)
    const configHash = getTotalSupplyConfigHash(config)

    const totalSupplies = timestamps.map((timestamp) => ({
      timestamp,
      isSynced: isSynced(statuses, timestamp, configHash),
    }))

    const title = `Total Supplies [chainId: ${chainId.toString()}]`

    return renderStatusPage({ statuses: totalSupplies, title })
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

  private getFirstHour(from: UnixTime | undefined) {
    if (from) {
      return from
    } else {
      const firstHour = this.clock.getFirstHour()
      const lastHour = this.clock.getLastHour()
      if (firstHour.gt(lastHour.add(-90, 'days'))) {
        return firstHour
      } else {
        return lastHour.add(-90, 'days')
      }
    }
  }
}

function isSynced(
  statuses: (ReportStatusRecord | BalanceStatusRecord)[],
  timestamp: UnixTime,
  configHash: Hash256,
): boolean {
  return (
    statuses.find((s) => s.timestamp.toString() === timestamp.toString())
      ?.configHash === configHash
  )
}
