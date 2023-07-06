import { ProjectId } from '@l2beat/shared-pure'

import { AggregatedReportRepository } from '../../peripherals/database/AggregatedReportRepository'
import { asNumber } from './tvl/asNumber'

export class DydxController {
  constructor(
    private readonly aggregatedReportsRepository: AggregatedReportRepository,
  ) {}

  async getTvl(): Promise<number | undefined> {
    const report = await this.aggregatedReportsRepository.findLatest(
      ProjectId('dydx'),
    )

    return report ? asNumber(report.tvlUsd, 2) : undefined
  }
}
