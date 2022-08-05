import {
  ApiMain,
  AssetId,
  Chart,
  Charts,
  Logger,
  ProjectId,
  TaskQueue,
} from '@l2beat/common'

import { Token } from '../../../model'
import { ProjectInfo } from '../../../model/ProjectInfo'
import { AggregateReportRepository } from '../../../peripherals/database/AggregateReportRepository'
import { CachedDataRepository } from '../../../peripherals/database/CachedDataRepository'
import { PriceRepository } from '../../../peripherals/database/PriceRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../peripherals/database/ReportStatusRepository'
import { addOptimismToken } from './addOptimismToken'
import { aggregateReportsDaily } from './aggregateReportsDaily'
import {
  getChartPoints,
  getHourlyMinTimestamp,
  getSixHourlyMinTimestamp,
} from './charts'
import { filterReportsByProjects } from './filter/filterReportsByProjects'
import { getSufficientlySynced } from './filter/getSufficientlySynced'
import { generateMain } from './generateMain'
import { generateReportOutput } from './generateReportOutput'

export class ReportController {
  private taskQueue: TaskQueue<void>

  constructor(
    private reportStatusRepository: ReportStatusRepository,
    private aggregateReportRepository: AggregateReportRepository,
    private reportRepository: ReportRepository,
    private cacheRepository: CachedDataRepository,
    private priceRepository: PriceRepository,
    private projects: ProjectInfo[],
    private tokens: Token[],
    private logger: Logger,
    private interval: number = 5 * 60 * 1000,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      async () => this.generateAndCache(),
      this.logger,
    )
  }

  start() {
    this.taskQueue.addIfEmpty()
    setInterval(() => this.taskQueue.addIfEmpty(), this.interval)
  }

  async getDaily() {
    return this.cacheRepository.getData()
  }

  async getMain(): Promise<ApiMain | undefined> {
    const timestamp = await this.reportStatusRepository.findLatestTimestamp()
    if (!timestamp) {
      return undefined
    }
    const dailyTimestamp = timestamp.toStartOf('day')
    const [hourlyReports, sixHourlyReports, dailyReports, latestReports] =
      await Promise.all([
        this.aggregateReportRepository.getHourly(
          getHourlyMinTimestamp(timestamp),
        ),
        this.aggregateReportRepository.getSixHourly(
          getSixHourlyMinTimestamp(timestamp),
        ),
        this.aggregateReportRepository.getDaily(),
        this.reportRepository.getByTimestamp(dailyTimestamp),
      ])
    const apiMain = generateMain(
      hourlyReports,
      sixHourlyReports,
      dailyReports,
      latestReports,
      this.projects,
    )
    return apiMain
  }

  async generateAndCache() {
    this.logger.info('Daily report started')
    const reports = await this.getReports()
    await this.cacheRepository.saveData(await this.generateDaily(reports))
    this.logger.info('Daily report saved')
  }

  async getReports() {
    let reports = await this.reportRepository.getDaily()
    reports = filterReportsByProjects(reports, this.projects)
    reports = getSufficientlySynced(reports)
    return reports
  }

  async generateDaily(reports: ReportRecord[]) {
    const dailyEntries = aggregateReportsDaily(reports, this.projects)
    await addOptimismToken(dailyEntries, this.priceRepository)
    return generateReportOutput(dailyEntries, this.projects)
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
