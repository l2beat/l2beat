import { Logger } from '@l2beat/backend-tools'
import {
  AssetId,
  Hash256,
  ProjectId,
  Token,
  TvlApiChart,
  TvlApiCharts,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { ReportProject } from '../../../core/reports/ReportProject'
import { AggregatedReportRepository } from '../../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../../peripherals/database/AggregatedReportStatusRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { getHourlyMinTimestamp } from '../utils/getHourlyMinTimestamp'
import { getSixHourlyMinTimestamp } from '../utils/getSixHourlyMinTimestamp'
import { getProjectAssetChartData } from './charts'
import { generateTvlApiResponse } from './generateTvlApiResponse'
import { Result } from './types'

interface TvlControllerOptions {
  errorOnUnsyncedTvl: boolean
}

type TvlResult = Result<TvlApiResponse, 'DATA_NOT_FULLY_SYNCED' | 'NO_DATA'>

type AssetTvlResult = Result<
  TvlApiCharts,
  'INVALID_PROJECT_OR_ASSET' | 'NO_DATA' | 'DATA_NOT_FULLY_SYNCED'
>

export class TvlController {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly aggregatedReportRepository: AggregatedReportRepository,
    private readonly aggregatedReportStatusRepository: AggregatedReportStatusRepository,
    private readonly projects: ReportProject[],
    private readonly tokens: Token[],
    private readonly aggregatedConfigHash: Hash256,
    private readonly options: TvlControllerOptions,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async getTvlApiResponse(): Promise<TvlResult> {
    const dataTimings = await this.getDataTimings()

    if (!dataTimings.latestTimestamp) {
      return {
        result: 'error',
        error: 'NO_DATA',
      }
    }

    if (!dataTimings.isSynced && this.options.errorOnUnsyncedTvl) {
      return {
        result: 'error',
        error: 'DATA_NOT_FULLY_SYNCED',
      }
    }

    const [hourlyReports, sixHourlyReports, dailyReports, latestReports] =
      await Promise.all([
        this.aggregatedReportRepository.getHourly(
          getHourlyMinTimestamp(dataTimings.latestTimestamp),
          'TVL',
        ),
        this.aggregatedReportRepository.getSixHourly(
          getSixHourlyMinTimestamp(dataTimings.latestTimestamp),
          'TVL',
        ),
        this.aggregatedReportRepository.getDaily('TVL'),
        this.reportRepository.getByTimestamp(dataTimings.latestTimestamp),
      ])

    const tvlApiResponse = generateTvlApiResponse(
      hourlyReports,
      sixHourlyReports,
      dailyReports,
      latestReports,
      this.projects.map((x) => x.projectId),
    )

    return {
      result: 'success',
      data: tvlApiResponse,
    }
  }

  async getProjectAssetChart(
    projectId: ProjectId,
    assetId: AssetId,
  ): Promise<AssetTvlResult> {
    const asset = this.tokens.find((t) => t.id === assetId)
    const project = this.projects.find((p) => p.projectId === projectId)

    if (!asset || !project) {
      return {
        result: 'error',
        error: 'INVALID_PROJECT_OR_ASSET',
      }
    }

    const dataTimings = await this.getDataTimings()

    if (!dataTimings.latestTimestamp) {
      return {
        result: 'error',
        error: 'NO_DATA',
      }
    }

    if (!dataTimings.isSynced && this.options.errorOnUnsyncedTvl) {
      return {
        result: 'error',
        error: 'DATA_NOT_FULLY_SYNCED',
      }
    }
    const [hourlyReports, sixHourlyReports, dailyReports] = await Promise.all([
      this.reportRepository.getHourlyByProjectAndAsset(
        projectId,
        assetId,
        getHourlyMinTimestamp(dataTimings.latestTimestamp),
      ),
      this.reportRepository.getSixHourlyByProjectAndAsset(
        projectId,
        assetId,
        getSixHourlyMinTimestamp(dataTimings.latestTimestamp),
      ),
      this.reportRepository.getDailyByProjectAndAsset(projectId, assetId),
    ])
    const types: TvlApiChart['types'] = [
      'timestamp',
      asset.symbol.toLowerCase(),
      'usd',
    ]

    return {
      result: 'success',
      data: {
        hourly: {
          types,
          data: getProjectAssetChartData(hourlyReports, asset.decimals, 1),
        },
        sixHourly: {
          types,
          data: getProjectAssetChartData(sixHourlyReports, asset.decimals, 6),
        },
        daily: {
          types,
          data: getProjectAssetChartData(dailyReports, asset.decimals, 24),
        },
      },
    }
  }

  // TODO: Move this function to a separate file and reuse it in controllers
  private async getDataTimings() {
    const { matching: syncedReportsAmount, different: unsyncedReportsAmount } =
      await this.aggregatedReportStatusRepository.findCountsForHash(
        this.aggregatedConfigHash,
      )

    const latestTimestamp =
      await this.aggregatedReportStatusRepository.findLatestTimestamp()

    const isSynced = unsyncedReportsAmount === 0

    const result = {
      syncedReportsAmount,
      unsyncedReportsAmount,
      isSynced,
      latestTimestamp,
    }

    return result
  }
}
