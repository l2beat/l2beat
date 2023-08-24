import { tokenList } from '@l2beat/config'
import { ConfigReader, DiscoveryDiff } from '@l2beat/discovery'
import {
  ChainId,
  getTimestamps,
  Hash256,
  ReportType,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import { getBalanceConfigHash } from '../../../core/balances/getBalanceConfigHash'
import { Clock } from '../../../core/Clock'
import { getEBVConfigHash } from '../../../core/reports/getEBVConfigHash'
import { getReportConfigHash } from '../../../core/reports/getReportConfigHash'
import { getTotalSupplyConfigHash } from '../../../core/totalSupply/getTotalSupplyConfigHash'
import { Project } from '../../../model'
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

  async getDiscoveryDashboard(chainId: ChainId): Promise<string> {
    const projects = await getDashboardProjects(
      this.configReader,
      this.updateMonitorRepository,
      chainId,
    )
    const projectsList = this.projects.map((p) => p.projectId.toString())

    return renderDashboardPage({
      projects,
      projectsList,
    })
  }

  async getDiscoveryDashboardProject(
    project: string,
    chainId: ChainId,
  ): Promise<string> {
    const discovery = await this.configReader.readDiscovery(project, chainId)
    const config = await this.configReader.readConfig(project, chainId)
    const contracts = getDashboardContracts(discovery, config)

    const diff: DiscoveryDiff[] = await getDiff(
      this.updateMonitorRepository,
      discovery,
      config,
      chainId,
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
    const config: Token[] = []
    const tokens = tokenList.filter(
      (t) => t.type === 'EBV' && t.chainId === chainId,
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

  async getReportsStatus(
    chainId: ChainId = ChainId.ETHEREUM,
    reportType: ReportType = 'CBV',
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
      reportType,
    )
    const configHash = getConfigHashForReports(chainId, this.projects)

    const reports = timestamps.map((timestamp) => ({
      timestamp,
      isSynced: isSynced(statuses, timestamp, configHash),
    }))

    const title = `Reports [chainId: ${chainId.toString()}] [type: ${reportType}]`

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
    const uniqueHashes = new Set<Hash256>()

    const reports = statuses
      .map((status) => {
        uniqueHashes.add(status.configHash)
        return {
          timestamp: status.timestamp,
          configHash: status.configHash,
        }
      })
      .sort((a, b) =>
        a.timestamp.toString().localeCompare(b.timestamp.toString()),
      )

    return renderAggregatedPage({
      statuses: reports,
      uniqueHashes: Array.from(uniqueHashes),
    })
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
        tokenList.filter(
          (t) => t.chainId === ChainId.ARBITRUM && t.type === 'EBV',
        ),
      )
    default:
      throw new Error(`Unknown chainId: ${chainId.toString()}`)
  }
}
