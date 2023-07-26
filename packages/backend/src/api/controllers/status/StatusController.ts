import { ConfigReader, DiscoveryDiff } from '@l2beat/discovery'
import {
  assert,
  ChainId,
  getTimestamps,
  Hash256,
  ProjectId,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'

import { getBalanceConfigHash } from '../../../core/balances/getBalanceConfigHash'
import { Clock } from '../../../core/Clock'
import { getEBVConfigHash } from '../../../core/reports/getEBVConfigHash'
import { getReportConfigHash } from '../../../core/reports/getReportConfigHash'
import { getTotalSupplyConfigHash } from '../../../core/totalSupply/getTotalSupplyConfigHash'
import { TotalSupplyTokensConfig } from '../../../core/totalSupply/TotalSupplyTokensConfig'
import { Project } from '../../../model'
import { Token } from '../../../model/Token'
import { AggregatedReportStatusRepository } from '../../../peripherals/database/AggregatedReportStatusRepository'
import {
  BalanceStatusRecord,
  BalanceStatusRepository,
} from '../../../peripherals/database/BalanceStatusRepository'
import { UpdateMonitorRepository } from '../../../peripherals/database/discovery/UpdateMonitorRepository'
import { PriceRepository } from '../../../peripherals/database/PriceRepository'
import {
  ReportStatusRecord,
  ReportStatusRepository,
} from '../../../peripherals/database/ReportStatusRepository'
import { TotalSupplyStatusRepository } from '../../../peripherals/database/TotalSupplyStatusRepository'
import { getDashboardContracts } from './discovery/props/getDashboardContracts'
import { getDashboardProjects } from './discovery/props/getDashboardProjects'
import { getDiff } from './discovery/props/utils/getDiff'
import { renderDashboardPage } from './discovery/view/DashboardPage'
import { renderDashboardProjectPage } from './discovery/view/DashboardProjectPage'
import { renderAggregatedPage } from './view/AggregatedReportsPage'
import { renderPricesPage } from './view/PricesPage'
import { renderStatusPage } from './view/StatusPage'

export class StatusController {
  constructor(
    private readonly priceRepository: PriceRepository,
    private readonly balanceStatusRepository: BalanceStatusRepository,
    private readonly totalSupplyStatusRepository: TotalSupplyStatusRepository,
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly aggregatedStatusRepository: AggregatedReportStatusRepository,
    private readonly updateMonitorRepository: UpdateMonitorRepository,
    private readonly clock: Clock,
    private readonly tokens: Token[],
    private readonly projects: Project[],
    private readonly configReader: ConfigReader,
  ) {}

  async getDiscoveryDashboard(): Promise<string> {
    const projects = await getDashboardProjects(
      this.configReader,
      this.updateMonitorRepository,
    )
    const projectsList = this.projects.map((p) => p.projectId.toString())

    return renderDashboardPage({
      projects,
      projectsList,
    })
  }

  async getDiscoveryDashboardProject(project: string): Promise<string> {
    const discovery = await this.configReader.readDiscovery(project)
    const config = await this.configReader.readConfig(project)
    const contracts = getDashboardContracts(discovery, config)

    const diff: DiscoveryDiff[] = await getDiff(
      this.updateMonitorRepository,
      discovery,
      config,
    )

    return renderDashboardProjectPage({
      projectName: project,
      contracts,
      diff,
    })
  }

  async getPricesStatus(
    from: UnixTime | undefined,
    to: UnixTime | undefined,
  ): Promise<string> {
    const firstHour = this.getFirstHour(from)
    const lastHour = to ? to : this.clock.getLastHour()

    const pricesByToken = await this.priceRepository.findLatestByTokenBetween(
      firstHour,
      lastHour,
    )

    const prices = this.tokens.map((token) => {
      const latest = pricesByToken.get(token.id)

      return {
        assetId: token.id,
        timestamp: latest,
        isSynced: latest?.toString() === lastHour.toString(),
      }
    })

    return renderPricesPage({ prices })
  }

  async getBalancesStatus(
    chainId: ChainId = ChainId.ETHEREUM,
    from: UnixTime | undefined,
    to: UnixTime | undefined,
  ): Promise<string> {
    const firstHour = this.getFirstHour(from)
    const lastHour = to ? to : this.clock.getLastHour()

    const timestamps = getTimestamps(firstHour, lastHour, 'hourly').reverse()

    const statuses = await this.balanceStatusRepository.getBetween(
      chainId,
      firstHour,
      lastHour,
    )
    const configHash = getBalanceConfigHash(this.projects)

    const balances = timestamps.map((timestamp) => ({
      timestamp,
      isSynced: isSynced(statuses, timestamp, configHash),
    }))

    const title = `Balances [chainId: ${chainId.toString()}]`

    return renderStatusPage({ statuses: balances, title })
  }

  async getTotalSuppliesStatus(
    chainId: ChainId = ChainId.ARBITRUM,
    from: UnixTime | undefined,
    to: UnixTime | undefined,
  ): Promise<string> {
    const firstHour = this.getFirstHour(from)
    const lastHour = to ? to : this.clock.getLastHour()

    const timestamps = getTimestamps(firstHour, lastHour, 'hourly').reverse()

    const statuses = await this.totalSupplyStatusRepository.getBetween(
      chainId,
      firstHour,
      lastHour,
    )
    const config: TotalSupplyTokensConfig[] = []
    const tokens = this.projects.find(
      (p) => p.externalTokens?.chainId === chainId,
    )?.externalTokens?.assets
    if (tokens) {
      config.push(...tokens)
    }
    const configHash = getTotalSupplyConfigHash(config)

    const totalSupplies = timestamps.map((timestamp) => ({
      timestamp,
      isSynced: isSynced(statuses, timestamp, configHash),
    }))

    const title = `Total Supplies [chainId: ${chainId.toString()}]`

    return renderStatusPage({ statuses: totalSupplies, title })
  }

  async getReportsStatus(
    chainId: ChainId = ChainId.ETHEREUM,
    valueType: ValueType = ValueType.CBV,
    from: UnixTime | undefined,
    to: UnixTime | undefined,
  ) {
    const firstHour = this.getFirstHour(from)
    const lastHour = to ? to : this.clock.getLastHour()

    const timestamps = getTimestamps(firstHour, lastHour, 'hourly').reverse()

    const statuses = await this.reportStatusRepository.getBetween(
      firstHour,
      lastHour,
      chainId,
      valueType,
    )
    const configHash = getConfigHashForReports(chainId, this.projects)

    const reports = timestamps.map((timestamp) => ({
      timestamp,
      isSynced: isSynced(statuses, timestamp, configHash),
    }))

    const title = `Reports [chainId: ${chainId.toString()}] [type: ${valueType.toString()}]`

    return renderStatusPage({ statuses: reports, title })
  }

  async getAggregatedStatus(
    from: UnixTime | undefined,
    to: UnixTime | undefined,
  ) {
    const firstHour = this.getFirstHour(from)
    const lastHour = to ? to : this.clock.getLastHour()

    const statuses = await this.aggregatedStatusRepository.getBetween(
      firstHour,
      lastHour,
    )

    const reports = statuses.map((status) => ({
      timestamp: status.timestamp,
      configHash: status.configHash,
    }))

    return renderAggregatedPage({ statuses: reports })
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

function getConfigHashForReports(chainId: ChainId, projects: Project[]) {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return getReportConfigHash(projects)
    case ChainId.ARBITRUM:
      return getEBVConfigHash(
        filterArbitrumProject(projects),
        getExternalTokens(filterArbitrumProject(projects)),
      )
    default:
      throw new Error(`Unknown chainId: ${chainId.toString()}`)
  }
}

function filterArbitrumProject(projects: Project[]) {
  const result = projects.filter((x) => x.projectId === ProjectId.ARBITRUM)
  assert(
    result.length === 1,
    'Expected there only to be a single matching project',
  )
  return result[0]
}

function getExternalTokens(project: Project) {
  assert(project.externalTokens, 'No external tokens configured')
  return project.externalTokens.assets
}
