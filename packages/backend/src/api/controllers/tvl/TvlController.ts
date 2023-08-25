import { Logger } from '@l2beat/shared'
import {
  AssetId,
  Hash256,
  ProjectId,
  Token,
  TvlApiChart,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'
import { writeFileSync } from 'fs'

import { ReportProject } from '../../../core/reports/ReportProject'
import { AggregatedReportRepository } from '../../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../../peripherals/database/AggregatedReportStatusRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { getHourlyMinTimestamp } from '../utils/getHourlyMinTimestamp'
import { getSixHourlyMinTimestamp } from '../utils/getSixHourlyMinTimestamp'
import { getProjectAssetChartData } from './charts'
import { generateTvlApiResponse } from './generateTvlApiResponse'
import { fillMissingAggregatedReports } from './timerange'

interface TvlControllerOptions {
  errorOnUnsyncedTvl: boolean
}

type TvlResult =
  | {
      result: 'success'
      data: TvlApiResponse
    }
  | {
      result: 'error'
      error: 'DATA_NOT_FULLY_SYNCED' | 'NO_DATA'
    }

type AssetTvlResult =
  | {
      result: 'success'
      data: TvlApiCharts
    }
  | {
      result: 'error'
      error: 'INVALID_PROJECT_OR_ASSET' | 'NO_DATA' | 'DATA_NOT_FULLY_SYNCED'
    }
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
    const {latestTimestamp, isSynced} = await this.getDataTimings()

    if (!latestTimestamp) {
      return {
        result: 'error',
        error: 'NO_DATA',
      }
    }

    if (!isSynced && this.options.errorOnUnsyncedTvl) {
      return {
        result: 'error',
        error: 'DATA_NOT_FULLY_SYNCED',
      }
    }

    const [hourlyReports, sixHourlyReports, dailyReports, latestReports] =
      await Promise.all([
        this.aggregatedReportRepository.getHourly(
          getHourlyMinTimestamp(latestTimestamp),
          'TVL',
        ),
        this.aggregatedReportRepository.getSixHourly(
          getSixHourlyMinTimestamp(latestTimestamp),
          'TVL',
        ),
        this.aggregatedReportRepository.getDaily('TVL'),
        this.reportRepository.getByTimestamp(latestTimestamp),
      ])

    const pids = [
      ...this.projects.map((x) => x.projectId),
      ProjectId.ALL,
      ProjectId.BRIDGES,
      ProjectId.LAYER2S,
    ]

    const filledHourlyReports = pids.flatMap((pid) =>
      fillMissingAggregatedReports(
        pid,
        hourlyReports.filter((r) => r.projectId === pid),
        getHourlyMinTimestamp(latestTimestamp),
        latestTimestamp,
        'hourly',
      ),
    )

    const filledSixHourlyReports = pids.flatMap((pid) =>
      fillMissingAggregatedReports(
        pid,
        sixHourlyReports.filter((r) => r.projectId === pid),
        getSixHourlyMinTimestamp(latestTimestamp),
        latestTimestamp,
        'sixHourly',
      ),
    )

    const filledDailyReports = pids.flatMap((pid) =>
      fillMissingAggregatedReports(
        pid,
        dailyReports.filter((r) => r.projectId === pid),
        UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
        latestTimestamp,
        'daily',
      ),
    )

    console.dir({
      hourly: {
        pre: hourlyReports.length,
        post: filledHourlyReports.length,
      },
      sixHourly: {
        pre: sixHourlyReports.length,
        post: filledSixHourlyReports.length,
      },
      daily: {
        pre: dailyReports.length,
        post: filledDailyReports.length,
      },
    })

    writeFileSync(
      'pids.json',
      JSON.stringify(
        this.projects.map((x) => x.projectId),
        null,
        2,
      ),
    )

    const tvlApiResponse = generateTvlApiResponse(
      filledHourlyReports,
      filledSixHourlyReports,
      filledDailyReports,
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
