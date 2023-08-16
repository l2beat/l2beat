import { Logger } from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  DetailedTvlApiResponse,
  EthereumAddress,
  Hash256,
  ProjectAssetsBreakdownApiResponse,
  ProjectId,
  Token,
  TvlApiChart,
  TvlApiCharts,
  ValueType,
} from '@l2beat/shared-pure'

import { ReportProject } from '../../../core/reports/ReportProject'
import { AggregatedReportRepository } from '../../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../../peripherals/database/AggregatedReportStatusRepository'
import { BalanceRepository } from '../../../peripherals/database/BalanceRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../peripherals/database/ReportStatusRepository'
import { getHourlyMinTimestamp } from '../utils/getHourlyMinTimestamp'
import { getSixHourlyMinTimestamp } from '../utils/getSixHourlyMinTimestamp'
import { asNumber } from './asNumber'
import { getProjectAssetChartData } from './charts'
import {
  groupByProjectIdAndAssetType,
  groupByProjectIdAndTimestamp,
} from './detailedTvl'
import { generateDetailedTvlApiResponse } from './generateDetailedTvlApiResponse'

interface DetailedTvlControllerOptions {
  errorOnUnsyncedDetailedTvl: boolean
}

type ProjectAssetBreakdownResult =
  | {
      result: 'success'
      data: ProjectAssetsBreakdownApiResponse
    }
  | {
      result: 'error'
      error: 'DATA_NOT_FULLY_SYNCED' | 'NO_DATA'
    }

type DetailedTvlResult =
  | {
      result: 'success'
      data: DetailedTvlApiResponse
    }
  | {
      result: 'error'
      error: 'DATA_NOT_FULLY_SYNCED' | 'NO_DATA'
    }

type DetailedAssetTvlResult =
  | {
      result: 'success'
      data: TvlApiCharts
    }
  | {
      result: 'error'
      error: 'INVALID_PROJECT_OR_ASSET' | 'NO_DATA'
    }

export class DetailedTvlController {
  constructor(
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly aggregatedReportRepository: AggregatedReportRepository,
    private readonly reportRepository: ReportRepository,
    private readonly aggregatedReportStatusRepository: AggregatedReportStatusRepository,
    private readonly balanceRepository: BalanceRepository,
    private readonly projects: ReportProject[],
    private readonly tokens: Token[],
    private readonly logger: Logger,
    private readonly aggregatedConfigHash: Hash256,
    private readonly options: DetailedTvlControllerOptions,
  ) {
    this.logger = this.logger.for(this)
  }

  /**
   * TODO: Add project exclusion?
   */
  async getDetailedTvlApiResponse(): Promise<DetailedTvlResult> {
    const dataTimings = await this.getDataTimings()

    if (!dataTimings.latestTimestamp) {
      return {
        result: 'error',
        error: 'NO_DATA',
      }
    }

    if (!dataTimings.isSynced && this.options.errorOnUnsyncedDetailedTvl) {
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

    const tvlApiResponse = generateDetailedTvlApiResponse(
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

  async getDetailedAssetTvlApiResponse(
    projectId: ProjectId,
    chainId: ChainId,
    assetId: AssetId,
    assetType: ValueType,
  ): Promise<DetailedAssetTvlResult> {
    const asset = this.tokens.find((t) => t.id === assetId)
    const project = this.projects.find((p) => p.projectId === projectId)

    if (!asset || !project) {
      return {
        result: 'error',
        error: 'INVALID_PROJECT_OR_ASSET',
      }
    }

    const timestampCandidate =
      await this.reportStatusRepository.findLatestTimestamp(chainId, assetType)

    if (!timestampCandidate) {
      return {
        result: 'error',
        error: 'NO_DATA',
      }
    }

    const [hourlyReports, sixHourlyReports, dailyReports] = await Promise.all([
      this.reportRepository.getHourlyForDetailed(
        projectId,
        chainId,
        assetId,
        assetType,
        getHourlyMinTimestamp(timestampCandidate),
      ),
      this.reportRepository.getSixHourlyForDetailed(
        projectId,
        chainId,
        assetId,
        assetType,
        getSixHourlyMinTimestamp(timestampCandidate),
      ),
      this.reportRepository.getDailyForDetailed(
        projectId,
        chainId,
        assetId,
        assetType,
      ),
    ])
    const assetSymbol = asset.symbol.toLowerCase()

    const types: TvlApiChart['types'] = ['timestamp', assetSymbol, 'usd']

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

    const latestReports = await this.reportRepository.getByTimestamp(
      dataTimings.latestTimestamp,
    )

    console.dir({ time: dataTimings.latestTimestamp.toDate() })

    const balances = await this.balanceRepository.getByTimestampWithAnyChain(
      dataTimings.latestTimestamp,
    )

    const nonZeroBalances = balances.filter((balance) => balance.balance > 0n)

    const externalReports = latestReports.filter(
      (report) => report.type === ValueType.EBV,
    )

    const nativeReports = latestReports.filter(
      (report) => report.type === ValueType.NMV,
    )

    const canonicalReports = latestReports.filter(
      (report) => report.type === ValueType.CBV && report.amount > 0,
    )

    const external = externalReports.map((report) => {
      const assetId = report.asset
      const chainId = report.chainId
      const amount = String(report.amount)
      const usdValue = String(report.usdValue)
      const usdPrice = String(
        asNumber(BigInt(report.amount / report.usdValue), 2),
      )
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const token = this.tokens.find(
        (token) => token.id.toString() === assetId.toString(),
      )

      const tokenAddress = token?.address ?? EthereumAddress.ZERO

      return {
        assetId,
        chainId,
        amount,
        usdValue,
        usdPrice,
        tokenAddress,
      }
    })

    const native = nativeReports.map((report) => {
      const assetId = report.asset
      const chainId = report.chainId
      const amount = String(report.amount)
      const usdValue = String(report.usdValue)
      const usdPrice = String(
        asNumber(BigInt(report.amount / report.usdValue), 2),
      )
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const token = this.tokens.find(
        (token) => token.id.toString() === assetId.toString(),
      )

      const tokenAddress = token?.address ?? EthereumAddress.ZERO

      return {
        assetId,
        chainId,
        amount,
        usdValue,
        usdPrice,
        tokenAddress,
      }
    })

    const canonical = this.projects.flatMap((project) => {
      return project.escrows.flatMap((escrow) => {
        return escrow.tokens.map((token) => {
          const escrowTokenBalance = nonZeroBalances.find(
            (balance) =>
              balance.holderAddress === escrow.address &&
              balance.assetId === token.id,
          )

          const escrowAddress = escrow.address
          const assetId = token.id
          const chainId = token.chainId
          const amount = escrowTokenBalance?.balance ?? 0n

          return {
            assetId,
            chainId,
            amount: String(amount),
            usdValue: '123',
            usdPrice: '123',
            escrowAddress,
          }
        })
      })
    })

    return Promise.resolve({
      result: 'success',
      data: {
        dataTimestamp: dataTimings.latestTimestamp,
        canonical,
        external,
        native,
      },
    })
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
