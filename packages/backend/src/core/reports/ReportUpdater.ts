import { Hash256, Logger, TaskQueue, UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../model'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { BalanceUpdater } from '../BalanceUpdater'
import { Clock } from '../Clock'
import { getConfigHash } from '../getConfigHash'
import { PriceUpdater } from '../PriceUpdater'
import { createReports } from './createReports'

export class ReportUpdater {
  private configHash: Hash256
  private taskQueue = new TaskQueue(this.update.bind(this), this.logger)

  constructor(
    private priceUpdater: PriceUpdater,
    private balanceUpdater: BalanceUpdater,
    private reportRepository: ReportRepository,
    private reportStatusRepository: ReportStatusRepository,
    private clock: Clock,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.configHash = getConfigHash(projects)
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
    await this.reportRepository.addOrUpdateMany(reports)
    await this.reportStatusRepository.add({
      configHash: this.configHash,
      timestamp,
    })
    this.logger.info('Report updated', { timestamp: timestamp.toNumber() })
  }
}
