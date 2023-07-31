import { Logger } from '@l2beat/shared'
import { DetailedTvlApiResponse, UnixTime } from '@l2beat/shared-pure'

import { ReportProject } from '../../../core/reports/ReportProject'
import { AggregatedReportRepository } from '../../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../../peripherals/database/AggregatedReportStatusRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../peripherals/database/ReportStatusRepository'
import { getHourlyMinTimestamp } from '../utils/getHourlyMinTimestamp'
import { getSixHourlyMinTimestamp } from '../utils/getSixHourlyMinTimestamp'
import {
  groupByProjectIdAndAsset,
  groupByProjectIdAndTimestamp,
} from './detailedTvl'
import { generateDetailedTvlApiResponse } from './generateDetailedTvlApiResponse'

export class DetailedTvlController {
  constructor(
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly aggregatedReportRepository: AggregatedReportRepository,
    private readonly aggregatedReportStatusRepository: AggregatedReportStatusRepository,
    private readonly reportRepository: ReportRepository,
    private readonly projects: ReportProject[],
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async getDetailedTvlApiResponse(): Promise<
    DetailedTvlApiResponse | undefined
  > {
    const [latestReportUpdateTime, latestAggregateReportUpdateTime] =
      await Promise.all([
        this.reportStatusRepository.findAnyLatestTimestamp(),
        this.aggregatedReportStatusRepository.findLatestTimestamp(),
      ])

    if (!latestReportUpdateTime || !latestAggregateReportUpdateTime) {
      return
    }

    const minimumTimestamp = new UnixTime(
      Math.min(
        Number(latestReportUpdateTime),
        Number(latestAggregateReportUpdateTime),
      ),
    )

    const [hourlyReports, sixHourlyReports, dailyReports, latestReports] =
      await Promise.all([
        this.aggregatedReportRepository.getHourlyWithAnyType(
          getHourlyMinTimestamp(minimumTimestamp),
        ),

        this.aggregatedReportRepository.getSixHourlyWithAnyType(
          getSixHourlyMinTimestamp(minimumTimestamp),
        ),

        this.aggregatedReportRepository.getDailyWithAnyType(),

        this.reportRepository.getByTimestamp(minimumTimestamp),
      ])

    /**
     * ProjectID => Timestamp => [Report, Report, Report, Report]
     * Ideally 4 reports per project per timestamp corresponding to 4 Value Types
     */
    const groupedHourlyReports = groupByProjectIdAndTimestamp(hourlyReports)

    const groupedSixHourlyReportsTree =
      groupByProjectIdAndTimestamp(sixHourlyReports)

    const groupedDailyReports = groupByProjectIdAndTimestamp(dailyReports)

    /**
     * ProjectID => Asset => Report[]
     * Ideally 1 report. Some chains like Arbitrum may have multiple reports per asset differentiated by Value Type
     * That isl 1 report for USDC of value type CBV and 1 report for USDC of value type EBV
     * Reduce (dedupe) occurs later in the call chain
     * @see getProjectTokensCharts
     */
    const groupedLatestReports = groupByProjectIdAndAsset(latestReports)

    const tvlApiResponse = generateDetailedTvlApiResponse(
      groupedHourlyReports,
      groupedSixHourlyReportsTree,
      groupedDailyReports,
      groupedLatestReports,
      this.projects.map((x) => x.projectId),
    )

    return tvlApiResponse
  }
}
