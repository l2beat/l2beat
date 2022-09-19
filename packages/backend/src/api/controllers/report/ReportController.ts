import { Logger } from '@l2beat/common'
import { ApiMain, AssetId, Chart, Charts, ProjectId } from '@l2beat/types'

import { ReportProject } from '../../../core/reports/ReportProject'
import { Token } from '../../../model'
import { AggregateReportRepository } from '../../../peripherals/database/AggregateReportRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../peripherals/database/ReportStatusRepository'
import {
  getChartPoints,
  getHourlyMinTimestamp,
  getSixHourlyMinTimestamp,
} from './charts'
import { generateMain } from './generateMain'

export class ReportController {
  constructor(
    private reportStatusRepository: ReportStatusRepository,
    private aggregateReportRepository: AggregateReportRepository,
    private reportRepository: ReportRepository,
    private projects: ReportProject[],
    private tokens: Token[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async getMain(): Promise<ApiMain | undefined> {
    const timestamp = await this.reportStatusRepository.findLatestTimestamp()
    if (!timestamp) {
      return undefined
    }
    const [hourlyReports, sixHourlyReports, dailyReports, latestReports] =
      await Promise.all([
        this.aggregateReportRepository.getHourly(
          getHourlyMinTimestamp(timestamp),
        ),
        this.aggregateReportRepository.getSixHourly(
          getSixHourlyMinTimestamp(timestamp),
        ),
        this.aggregateReportRepository.getDaily(),
        this.reportRepository.getByTimestamp(timestamp),
      ])
    const apiMain = generateMain(
      hourlyReports,
      sixHourlyReports,
      dailyReports,
      latestReports,
      this.projects.map((x) => x.projectId),
    )
    return apiMain
  }

  private getChartData(
    reports: ReportRecord[],
    decimals: number,
    hours: number,
  ) {
    const balances = reports.map((r) => ({
      timestamp: r.timestamp,
      usd: r.balanceUsd,
      asset: r.balance,
    }))
    return getChartPoints(balances, hours, decimals)
  }

  async getProjectAssetChart(
    projectId: ProjectId,
    assetId: AssetId,
  ): Promise<Charts | undefined> {
    const project = this.projects.find((p) => p.projectId === projectId)
    const asset = this.tokens.find((t) => t.id === assetId)
    if (!project || !asset) {
      return undefined
    }
    const timestamp = await this.reportStatusRepository.findLatestTimestamp()
    if (!timestamp) {
      return undefined
    }
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
    const types: Chart['types'] = [
      'timestamp',
      asset.symbol.toLowerCase(),
      'usd',
    ]
    return {
      hourly: {
        types,
        data: this.getChartData(hourlyReports, asset.decimals, 1),
      },
      sixHourly: {
        types,
        data: this.getChartData(sixHourlyReports, asset.decimals, 6),
      },
      daily: {
        types,
        data: this.getChartData(dailyReports, asset.decimals, 24),
      },
    }
  }
}
