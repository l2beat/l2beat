import {
  ApiMain,
  AssetId,
  Chart,
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
    const latestTimestamp =
      await this.reportStatusRepository.findLatestTimestamp()
    if (!latestTimestamp) {
      return undefined
    }
    const [aggregateReports, tokenBreakdown] = await Promise.all([
      this.aggregateReportRepository.getDaily(),
      this.reportRepository.getByTimestamp(latestTimestamp),
    ])

    const apiMain = generateMain(
      aggregateReports,
      tokenBreakdown,
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

  async getProjectAssetChart(
    projectId: ProjectId,
    assetId: AssetId,
  ): Promise<Chart | undefined> {
    const project = this.projects.find((p) => p.projectId === projectId)
    const asset = this.tokens.find((t) => t.id === assetId)
    if (!project || !asset) {
      return undefined
    }
    const reports = await this.reportRepository.getDailyByProjectAndAsset(
      projectId,
      assetId,
    )
    return {
      types: ['timestamp', asset.symbol.toLowerCase(), 'usd'],
      data: reports.map((r) => [
        r.timestamp,
        +asNumber(r.balance, asset.decimals).toFixed(6),
        asNumber(r.balanceUsd, 2),
      ]),
    }
  }
}
