import { ProjectId } from '@l2beat/shared'

import { AggregateReportRepository } from '../../peripherals/database/AggregateReportRepository'
import { asNumber } from './tvl/asNumber'

export class DydxController {
  constructor(
    private readonly aggregateReportsRepository: AggregateReportRepository,
  ) {}

  async getTvl(): Promise<number | undefined> {
    const report = await this.aggregateReportsRepository.findLatest(
      ProjectId('dydx'),
    )

    return report ? asNumber(report.tvlUsd, 2) : undefined
  }
}
