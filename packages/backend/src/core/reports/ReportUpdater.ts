import { Hash256, Logger, UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../model'
import { BalanceRepository } from '../../peripherals/database/BalanceRepository'
import { PriceRepository } from '../../peripherals/database/PriceRepository'
import { ReportProgressRepository } from '../../peripherals/database/ReportProgressRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { createReports } from './createReports'
import { getReportsConfigHash } from './getReportsConfigHash'

export class ReportUpdater {
  private configHash: Hash256

  constructor(
    private priceRepository: PriceRepository,
    private balanceRepository: BalanceRepository,
    private reportRepository: ReportRepository,
    private reportProgressRepository: ReportProgressRepository,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.configHash = getReportsConfigHash(projects)
  }

  async update(timestamps: UnixTime[]) {
    this.logger.info('Update started', { timestamps: timestamps.length })
    const known = await this.reportProgressRepository.getByConfigHash(
      this.configHash,
    )
    const knownSet = new Set(known.map((x) => x.toNumber()))

    for (const timestamp of timestamps) {
      if (!knownSet.has(timestamp.toNumber())) {
        await this.updateForTimestamp(timestamp)
      }
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
    await this.reportProgressRepository.add({
      configHash: this.configHash,
      timestamp,
    })
    this.logger.info('Report updated', { timestamp: timestamp.toString() })
  }
}
