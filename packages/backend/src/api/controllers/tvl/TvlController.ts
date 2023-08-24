import { Logger } from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  ProjectId,
  Token,
  TvlApiChart,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { ReportProject } from '../../../core/reports/ReportProject'
import { AggregatedReportRepository } from '../../../peripherals/database/AggregatedReportRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../peripherals/database/ReportStatusRepository'
import { getHourlyMinTimestamp } from '../utils/getHourlyMinTimestamp'
import { getSixHourlyMinTimestamp } from '../utils/getSixHourlyMinTimestamp'
import { getProjectAssetChartData } from './charts'
import { generateTvlApiResponse } from './generateTvlApiResponse'

export class TvlController {
  constructor(
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly aggregatedReportRepository: AggregatedReportRepository,
    private readonly reportRepository: ReportRepository,
    private readonly projects: ReportProject[],
    private readonly tokens: Token[],
    private readonly logger: Logger,
    private readonly isArbitrumEnabled = false,
  ) {
    this.logger = this.logger.for(this)
  }

  async getTvlApiResponse(): Promise<TvlApiResponse | undefined> {
    const timestamps: (UnixTime | undefined)[] = []

    timestamps.push(
      await this.reportStatusRepository.findLatestTimestamp(
        ChainId.ETHEREUM,
        'CBV',
      ),
    )
    if (this.isArbitrumEnabled) {
      timestamps.push(
        await this.reportStatusRepository.findLatestTimestamp(
          ChainId.ARBITRUM,
          'EBV',
        ),
      )
    }

    if (timestamps.some((x) => x === undefined)) {
      return undefined
    }

    const timestamp = timestamps
      .filter(notUndefined)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .reduce((min, t) => (t.lt(min) ? t : min), timestamps[0]!)

    const [hourlyReports, sixHourlyReports, dailyReports, latestReports] =
      await Promise.all([
        this.aggregatedReportRepository.getHourly(
          getHourlyMinTimestamp(timestamp),
          'TVL',
        ),
        this.aggregatedReportRepository.getSixHourly(
          getSixHourlyMinTimestamp(timestamp),
          'TVL',
        ),
        this.aggregatedReportRepository.getDaily('TVL'),
        this.reportRepository.getByTimestamp(timestamp),
      ])

    const tvlApiResponse = generateTvlApiResponse(
      hourlyReports,
      sixHourlyReports,
      dailyReports,
      reduceDuplicatedReports(latestReports),
      this.projects.map((x) => x.projectId),
    )
    return tvlApiResponse
  }

  async getProjectAssetChart(
    projectId: ProjectId,
    assetId: AssetId,
  ): Promise<TvlApiCharts | undefined> {
    const project = this.projects.find((p) => p.projectId === projectId)
    const asset = this.tokens.find((t) => t.id === assetId)
    if (!project || !asset) {
      return undefined
    }

    const timestamps: (UnixTime | undefined)[] = []

    timestamps.push(
      await this.reportStatusRepository.findLatestTimestamp(
        ChainId.ETHEREUM,
        'CBV',
      ),
    )
    if (
      this.isArbitrumEnabled &&
      projectId === ProjectId.ARBITRUM &&
      assetId === AssetId.USDC
    ) {
      timestamps.push(
        await this.reportStatusRepository.findLatestTimestamp(
          ChainId.ARBITRUM,
          'EBV',
        ),
      )
    }

    if (timestamps.some((x) => x === undefined)) {
      return undefined
    }

    const timestamp = timestamps
      .filter(notUndefined)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .reduce((min, t) => (t.lt(min) ? t : min), timestamps[0]!)

    const [hourlyReports, sixHourlyReports, dailyReports] = await Promise.all([
      this.reportRepository.getHourlyByProjectAndAsset(
        projectId,
        assetId,
        getHourlyMinTimestamp(timestamp),
      ),
      this.reportRepository.getSixHourlyByProjectAndAsset(
        projectId,
        assetId,
        getSixHourlyMinTimestamp(timestamp),
      ),
      this.reportRepository.getDailyByProjectAndAsset(projectId, assetId),
    ])
    const types: TvlApiChart['types'] = [
      'timestamp',
      asset.symbol.toLowerCase(),
      'usd',
    ]
    return {
      hourly: {
        types,
        data: getProjectAssetChartData(
          reduceDuplicatedReports(hourlyReports),
          asset.decimals,
          1,
        ),
      },
      sixHourly: {
        types,
        data: getProjectAssetChartData(
          reduceDuplicatedReports(sixHourlyReports),
          asset.decimals,
          6,
        ),
      },
      daily: {
        types,
        data: getProjectAssetChartData(
          reduceDuplicatedReports(dailyReports),
          asset.decimals,
          24,
        ),
      },
    }
  }
}

export function reduceDuplicatedReports(
  reports: ReportRecord[],
): ReportRecord[] {
  const result: ReportRecord[] = []

  for (const report of reports) {
    const existingIndex = result.findIndex(
      (r) =>
        r.projectId === report.projectId &&
        r.asset === report.asset &&
        r.timestamp.equals(report.timestamp),
    )
    if (existingIndex !== -1) {
      const existing = result[existingIndex]

      result[existingIndex] = {
        ...existing,
        amount: existing.amount + report.amount,
        usdValue: existing.usdValue + report.usdValue,
        ethValue: existing.ethValue + report.ethValue,
      }
    } else {
      result.push(report)
    }
  }

  return result
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
