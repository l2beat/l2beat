import { Logger } from '@l2beat/shared'
import { assert, ChainId, Hash256, UnixTime, ValueType } from '@l2beat/shared-pure'
import {
  ReportRecord,
  ReportRepository,
} from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { BalanceUpdater } from '../balances/BalanceUpdater'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { TaskQueue } from '../queue/TaskQueue'
import { createReports, createTotalSupplyReports } from '../reports/createReports'
import { ReportProject } from '../reports/ReportProject'
import { setTimeout } from 'timers/promises'
import { TotalSupplyUpdater } from '../totalSupply/TotalSupplyUpdater'
import { AssetUpdater } from './AssetUpdater'
import { TotalSupplyTokensConfig } from '../totalSupply/TotalSupplyTokensConfig'
import { ARBITRUM_PROJECT_ID } from '../reports/custom/arbitrum'
import { getReportConfigHash } from '../reports/getReportConfigHash'

export class ArbitrumEBVUpdater implements AssetUpdater {
  private readonly configHash: Hash256
  private readonly taskQueue: TaskQueue<UnixTime>
  private readonly knownSet = new Set<number>()
  private readonly arbitrumProject: ReportProject

  constructor(
    private readonly priceUpdater: PriceUpdater,
    private readonly balanceUpdater: BalanceUpdater,
    private readonly totalSupplyUpdater: TotalSupplyUpdater,
    private readonly reportRepository: ReportRepository,
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly clock: Clock,
    projects: ReportProject[],
    private readonly tokens: TotalSupplyTokensConfig[],
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
        const filtered = projects.filter((x) => x.projectId == ARBITRUM_PROJECT_ID)
    assert(filtered.length === 1, "Expected there to be a single project when filtered")
    this.arbitrumProject = filtered[0]
    this.configHash = getReportConfigHash([this.arbitrumProject])

    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: ArbitrumEBVUpdater.name,
      },
    )
  }

  getChainId() {
    return ChainId.ARBITRUM
  }

  getConfigHash() {
    return this.configHash
  }

  async start() {
    const known = await this.reportStatusRepository.getByConfigHash(
      this.getConfigHash(),
      this.getChainId(),
      ValueType.EBV,
    )

    for (const timestamp of known) {
      this.knownSet.add(timestamp.toNumber())
    }

    this.logger.info('Started')
    return this.clock.onEveryHour((timestamp) => {
      if (!this.knownSet.has(timestamp.toNumber())) {
        // we add to front to sync from newest to oldest
        this.taskQueue.addToFront(timestamp)
      }
    })
  }

  async update(timestamp: UnixTime) {
    this.logger.debug('Update started', { timestamp: timestamp.toNumber() })
    const [prices, balances, totalSupplies] = await Promise.all([
      this.priceUpdater.getPricesWhenReady(timestamp),
      this.balanceUpdater.getBalancesWhenReady(timestamp),
      this.totalSupplyUpdater.getTotalSuppliesWhenReady(timestamp),
    ])
    this.logger.debug('Prices, balances and supplies ready')

    let reports = createTotalSupplyReports(
      prices,
      balances,
      totalSupplies,
      this.arbitrumProject,
      this.getChainId(),
    )
    await this.reportRepository.addOrUpdateMany(reports)

    await this.reportStatusRepository.add({
      configHash: this.getConfigHash(),
      timestamp,
      chainId: this.getChainId(),
      valueType: ValueType.EBV,
    })

    this.knownSet.add(timestamp.toNumber())
    this.logger.info('Report updated', { timestamp: timestamp.toNumber() })
  }

  async getReportsWhenReady(
    timestamp: UnixTime,
    refreshIntervalMs = 1000,
  ): Promise<ReportRecord[]> {
    while (!this.knownSet.has(timestamp.toNumber())) {
      await setTimeout(refreshIntervalMs)
    }
    return this.reportRepository.getByTimestampAndPreciseAsset(
      timestamp,
      this.getChainId(),
      ValueType.EBV,
    )
  }
}
