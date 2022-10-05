import { Logger, TaskQueue } from '@l2beat/common'
import { Hash256, UnixTime } from '@l2beat/types'

import { AggregateReportRepository } from '../../peripherals/database/AggregateReportRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { BalanceUpdater } from '../balances/BalanceUpdater'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { aggregateReports } from './aggregateReports'
import { createReports } from './createReports'
import { getReportConfigHash } from './getReportConfigHash'
import { addOpTokenReport } from './optimism'
import { ReportProject } from './ReportProject'

export class ReportUpdater {
  private readonly configHash: Hash256
  private readonly taskQueue: TaskQueue<UnixTime>

  constructor(
    private readonly priceUpdater: PriceUpdater,
    private readonly balanceUpdater: BalanceUpdater,
    private readonly reportRepository: ReportRepository,
    private readonly aggregateReportsRepository: AggregateReportRepository,
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly clock: Clock,
    private readonly projects: ReportProject[],
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.configHash = getReportConfigHash(projects)
    this.taskQueue = new TaskQueue(
      this.update.bind(this),
      this.logger.for('taskQueue'),
    )
  }

  async start() {
    const known = await this.reportStatusRepository.getByConfigHash(
      this.configHash,
    )
    const knownSet = new Set(known.map((x) => x.toNumber()))

    this.logger.info('Started')
    return this.clock.onEveryHour((timestamp) => {
      if (!knownSet.has(timestamp.toNumber())) {
        // we add to front to sync from newest to oldest
        this.taskQueue.addToFront(timestamp)
      }
    })
  }

  async update(timestamp: UnixTime) {
    this.logger.debug('Update started', { timestamp: timestamp.toNumber() })
    const [prices, balances] = await Promise.all([
      this.priceUpdater.getPricesWhenReady(timestamp),
      this.balanceUpdater.getBalancesWhenReady(timestamp),
    ])
    this.logger.debug('Prices and balances ready')
    const reports = createReports(prices, balances, this.projects)
    addOpTokenReport(reports, prices, timestamp)
    const aggregatedReports = aggregateReports(
      reports,
      this.projects,
      timestamp,
    )
    await Promise.all([
      this.reportRepository.addOrUpdateMany(reports),
      this.aggregateReportsRepository.addOrUpdateMany(aggregatedReports),
    ])
    await this.reportStatusRepository.add({
      configHash: this.configHash,
      timestamp,
    })
    this.logger.info('Report updated', { timestamp: timestamp.toNumber() })
  }
}
