import { Hash256, Logger, UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../model'
import { BalanceRepository } from '../../peripherals/database/BalanceRepository'
import { PriceRepository } from '../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { getConfigHash } from '../getConfigHash'
import { createReports } from './createReports'

export class ReportUpdater {
  private configHash: Hash256

  constructor(
    private priceRepository: PriceRepository,
    private balanceRepository: BalanceRepository,
    private reportRepository: ReportRepository,
    private reportStatusRepository: ReportStatusRepository,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.configHash = getConfigHash(projects)
  }

  async update(timestamps: UnixTime[]) {
    this.logger.info('Update started', { timestamps: timestamps.length })
    const known = await this.reportStatusRepository.getByConfigHash(
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
    await this.reportStatusRepository.add({
      configHash: this.configHash,
      timestamp,
    })
    this.logger.info('Report updated', { timestamp: timestamp.toString() })
  }
}
