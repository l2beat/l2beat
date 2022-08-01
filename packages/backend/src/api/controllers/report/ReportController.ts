import {
  ApiMain,
  AssetId,
  Chart,
  ChartPoint,
  Logger,
  ProjectId,
  TaskQueue,
} from '@l2beat/common'

import { addMissingDailyTimestamps } from '../../../core/reports/charts'
import {
  addOpTokenToReports,
  getOpTokenDailyChartData,
  OP_TOKEN_ID,
} from '../../../core/reports/optimism'
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
import { asNumber } from './asNumber'
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
    const [aggregateReports, latestReports, ethPrices, opPrices] =
      await Promise.all([
        this.aggregateReportRepository.getDaily(),
        this.reportRepository.getByTimestamp(dailyTimestamp),
        this.priceRepository.getByToken(AssetId.ETH),
        this.priceRepository.getByToken(OP_TOKEN_ID),
      ])

    addOpTokenToReports(
      aggregateReports,
      latestReports,
      opPrices,
      ethPrices,
      dailyTimestamp,
    )

    const apiMain = generateMain(aggregateReports, latestReports, this.projects)

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

  private async getOpTokenChartData() {
    const prices = await this.priceRepository.getByToken(OP_TOKEN_ID)
    return getOpTokenDailyChartData(prices)
  }

  private async getChartData(asset: Token, projectId: ProjectId) {
    const data =
      asset.id === OP_TOKEN_ID
        ? await this.getOpTokenChartData()
        : await this.reportRepository.getDailyByProjectAndAsset(
            projectId,
            asset.id,
          )
    const points: ChartPoint[] = data.map((d) => [
      d.timestamp.add(-1, 'days').toStartOf('day'),
      +asNumber(d.balance, asset.decimals).toFixed(6),
      asNumber(d.balanceUsd, 2),
    ])
    return addMissingDailyTimestamps(points)
  }

  async getProjectAssetChart(
    projectId: ProjectId,
    assetId: AssetId,
  ): Promise<Chart | undefined> {
    const project = this.projects.find((p) => p.projectId === projectId)
    const asset = this.tokens.find((t) => t.id === assetId)
    if (!project || !asset) {
      return undefined
    }
    const data = await this.getChartData(asset, projectId)
    return {
      types: ['timestamp', asset.symbol.toLowerCase(), 'usd'],
      data,
    }
  }
}
