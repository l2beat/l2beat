import { Logger } from '@l2beat/backend-tools'
import { bridges, layer2s } from '@l2beat/config'
import {
  AssetId,
  ChainId,
  Hash256,
  ProjectAssetsBreakdownApiResponse,
  ProjectId,
  ReportType,
  Token,
  TokenTvlApiChart,
  TokenTvlApiCharts,
  TvlApiChart,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { ReportProject } from '../../../core/reports/ReportProject'
import { AggregatedReportRepository } from '../../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../../peripherals/database/AggregatedReportStatusRepository'
import { BalanceRepository } from '../../../peripherals/database/BalanceRepository'
import { PriceRepository } from '../../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { getHourlyMinTimestamp } from '../utils/getHourlyMinTimestamp'
import { getSixHourlyMinTimestamp } from '../utils/getSixHourlyMinTimestamp'
import { asNumber } from './asNumber'
import { getProjectAssetChartData } from './charts'
import { generateTvlApiResponse } from './generateTvlApiResponse'
import {
  getCanonicalAssetsBreakdown,
  getNonCanonicalAssetsBreakdown,
  groupAndMergeBreakdowns,
  groupByProjectIdAndAssetType,
  groupByProjectIdAndTimestamp,
} from './tvl'
import { Result } from './types'

interface TvlControllerOptions {
  errorOnUnsyncedTvl: boolean
}

type ProjectAssetBreakdownResult = Result<
  ProjectAssetsBreakdownApiResponse,
  'DATA_NOT_FULLY_SYNCED' | 'NO_DATA'
>

type TvlResult = Result<TvlApiResponse, 'DATA_NOT_FULLY_SYNCED' | 'NO_DATA'>

type TokenTvlResult = Result<
  TokenTvlApiCharts,
  'INVALID_PROJECT_OR_ASSET' | 'NO_DATA' | 'DATA_NOT_FULLY_SYNCED'
>

type AggregatedTvlResult = Result<
  TvlApiCharts,
  'DATA_NOT_FULLY_SYNCED' | 'NO_DATA' | 'EMPTY_SLUG'
>

export class TvlController {
  constructor(
    private readonly aggregatedReportRepository: AggregatedReportRepository,
    private readonly reportRepository: ReportRepository,
    private readonly aggregatedReportStatusRepository: AggregatedReportStatusRepository,
    private readonly balanceRepository: BalanceRepository,
    private readonly priceRepository: PriceRepository,
    private readonly projects: ReportProject[],
    private readonly tokens: Token[],
    private readonly logger: Logger,
    private readonly aggregatedConfigHash: Hash256,
    private readonly options: TvlControllerOptions,
  ) {
    this.logger = this.logger.for(this)
  }

  /**
   * TODO: Add project exclusion?
   */
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
        this.aggregatedReportRepository.getHourlyWithAnyType(
          getHourlyMinTimestamp(dataTimings.latestTimestamp),
        ),

        this.aggregatedReportRepository.getSixHourlyWithAnyType(
          getSixHourlyMinTimestamp(dataTimings.latestTimestamp),
        ),

        this.aggregatedReportRepository.getDailyWithAnyType(),

        this.reportRepository.getByTimestamp(dataTimings.latestTimestamp),
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
    const groupedLatestReports = groupByProjectIdAndAssetType(latestReports)

    const tvlApiResponse = generateTvlApiResponse(
      groupedHourlyReports,
      groupedSixHourlyReportsTree,
      groupedDailyReports,
      groupedLatestReports,
      this.projects.map((x) => x.projectId),
    )

    return {
      result: 'success',
      data: tvlApiResponse,
    }
  }

  async getAggregatedTvlApiResponse(
    slugs: string[],
  ): Promise<AggregatedTvlResult> {
    console.time('[Aggregate endpoint]: setup')

    const projectIdsFilter = [...layer2s, ...bridges]
      .filter((project) => slugs.includes(project.display.slug))
      .map((project) => project.id)

    if (projectIdsFilter.length === 0) {
      return {
        result: 'error',
        error: 'EMPTY_SLUG',
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
    console.timeEnd('[Aggregate endpoint]: setup')

    console.time('[Aggregate endpoint]: database')
    const [hourlyReports, sixHourlyReports, dailyReports] = await Promise.all([
      this.aggregatedReportRepository.getAggregateHourly(
        projectIdsFilter,
        getHourlyMinTimestamp(dataTimings.latestTimestamp),
      ),
      this.aggregatedReportRepository.getAggregateSixHourly(
        projectIdsFilter,
        getSixHourlyMinTimestamp(dataTimings.latestTimestamp),
      ),
      this.aggregatedReportRepository.getAggregateDaily(projectIdsFilter),
    ])
    console.timeEnd('[Aggregate endpoint]: database')

    console.time('[Aggregate endpoint]: aggregation')

    const data: TvlApiCharts = {
      hourly: aggregateRecordsToResponse(hourlyReports),
      sixHourly: aggregateRecordsToResponse(sixHourlyReports),
      daily: aggregateRecordsToResponse(dailyReports),
    }

    console.timeEnd('[Aggregate endpoint]: aggregation')

    return {
      result: 'success',
      data,
    }
  }

  async getAssetTvlApiResponse(
    projectId: ProjectId,
    chainId: ChainId,
    assetId: AssetId,
    assetType: ReportType,
  ): Promise<TokenTvlResult> {
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
      this.reportRepository.getHourly(
        projectId,
        chainId,
        assetId,
        assetType,
        getHourlyMinTimestamp(dataTimings.latestTimestamp),
      ),
      this.reportRepository.getSixHourly(
        projectId,
        chainId,
        assetId,
        assetType,
        getSixHourlyMinTimestamp(dataTimings.latestTimestamp),
      ),
      this.reportRepository.getDaily(projectId, chainId, assetId, assetType),
    ])
    const assetSymbol = asset.symbol.toLowerCase()

    const types: TokenTvlApiChart['types'] = ['timestamp', assetSymbol, 'usd']

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

  async getProjectTokenBreakdownApiResponse(): Promise<ProjectAssetBreakdownResult> {
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

    const [latestReports, balances, prices] = await Promise.all([
      this.reportRepository.getByTimestamp(dataTimings.latestTimestamp),
      this.balanceRepository.getByTimestamp(dataTimings.latestTimestamp),
      this.priceRepository.getByTimestamp(dataTimings.latestTimestamp),
    ])

    const externalAssetsBreakdown = getNonCanonicalAssetsBreakdown(this.logger)(
      latestReports,
      this.tokens,
      'EBV',
    )

    const nativeAssetsBreakdown = getNonCanonicalAssetsBreakdown(this.logger)(
      latestReports,
      this.tokens,
      'NMV',
    )

    const canonicalAssetsBreakdown = getCanonicalAssetsBreakdown(this.logger)(
      balances,
      prices,
      this.projects,
    )

    const breakdowns = groupAndMergeBreakdowns(this.projects, {
      external: externalAssetsBreakdown,
      native: nativeAssetsBreakdown,
      canonical: canonicalAssetsBreakdown,
    })

    return {
      result: 'success',
      data: {
        dataTimestamp: dataTimings.latestTimestamp,
        breakdowns,
      },
    }
  }

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

export const TYPE_LABELS: TvlApiChart['types'] = [
  'timestamp',
  'valueUsd',
  'cbvUsd',
  'ebvUsd',
  'nmvUsd',
  'valueEth',
  'cbvEth',
  'ebvEth',
  'nmvEth',
]

function aggregateRecordsToResponse(
  hourlyReports: {
    timestamp: UnixTime
    cbvUsdValue: bigint
    cbvEthValue: bigint
    ebvUsdValue: bigint
    ebvEthValue: bigint
    nmvUsdValue: bigint
    nmvEthValue: bigint
    tvlUsdValue: bigint
    tvlEthValue: bigint
  }[],
): TvlApiChart {
  return {
    types: TYPE_LABELS,
    data: hourlyReports.map((report) => [
      report.timestamp,
      asNumber(report.tvlUsdValue, 2),
      asNumber(report.cbvUsdValue, 2),
      asNumber(report.ebvUsdValue, 2),
      asNumber(report.nmvUsdValue, 2),
      asNumber(report.tvlEthValue, 6),
      asNumber(report.cbvEthValue, 6),
      asNumber(report.ebvEthValue, 6),
      asNumber(report.nmvEthValue, 6),
    ]),
  }
}
