import { Logger, UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../model'
import { BalanceRepository } from '../../peripherals/database/BalanceRepository'
import { PriceRepository } from '../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { createReports } from './createReports'

export class ReportUpdater {
  private lastProcessed = new UnixTime(0)

  constructor(
    private priceRepository: PriceRepository,
    private balanceRepository: BalanceRepository,
    private reportRepository: ReportRepository,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(timestamps: UnixTime[]) {
    timestamps = timestamps.filter((x) => x.gt(this.lastProcessed))
    this.logger.info('Update started', { timestamps: timestamps.length })
    for (const timestamp of timestamps) {
      await this.updateForTimestamp(timestamp)
    }
    this.logger.info('Update completed', { timestamps: timestamps.length })
  }

  async updateForTimestamp(timestamp: UnixTime) {
    const [prices, balances] = await Promise.all([
      this.priceRepository.getByTimestamp(timestamp),
      this.balanceRepository.getByTimestamp(timestamp),
    ])
    const reports = createReports(prices, balances, this.projects)
    await this.reportRepository.addOrUpdateMany(reports)
    this.lastProcessed = timestamp
    this.logger.info('Report updated', { timestamp: timestamp.toString() })
  }
}
