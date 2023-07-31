import { Logger } from '@l2beat/shared'
import {
  DetailedTvlApiResponse,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'

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
    private readonly reportRepository: ReportRepository,
    private readonly aggregatedReportStatusRepository: AggregatedReportStatusRepository,
    private readonly projects: ReportProject[],
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  /**
   * TODO: Add project exclusion?
   */
  async getDetailedTvlApiResponse(): Promise<
    DetailedTvlApiResponse | undefined
  > {
    const minimumTimestamp = await this.getMinimumTimestamp()

    if (!minimumTimestamp) {
      return
    }

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

  async getMinimumTimestamp(): Promise<UnixTime | undefined> {
    const valueTypes = [ValueType.CBV, ValueType.EBV, ValueType.NMV]

    const reportsTimestampsPromises = valueTypes.map((valueType) =>
      this.reportStatusRepository.findLatestTimestampOfType(valueType),
    )

    const aggregatedReportsTimestampsPromises = [
      this.aggregatedReportStatusRepository.findLatestTimestamp(),
    ]

    const timestampCandidates = await Promise.all([
      ...reportsTimestampsPromises,
      ...aggregatedReportsTimestampsPromises,
    ])

    if (!timestampCandidates.every(Boolean)) {
      return
    }

    const minimumTimestamp = Math.min(
      ...timestampCandidates.filter(notUndefined).map((x) => Number(x)),
    )

    return new UnixTime(minimumTimestamp)
  }
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
