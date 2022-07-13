import { AssetId, Chart, Logger, ProjectId, TaskQueue } from '@l2beat/common'

import { Token } from '../../../model'
import { ProjectInfo } from '../../../model/ProjectInfo'
import { CachedDataRepository } from '../../../peripherals/database/CachedDataRepository'
import { PriceRepository } from '../../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { addOptimismToken } from './addOptimismToken'
import { aggregateReportsDaily } from './aggregateReportsDaily'
import { asNumber } from './asNumber'
import { filterReportsByProjects } from './filter/filterReportsByProjects'
import { getSufficientlySynced } from './filter/getSufficientlySynced'
import { generateReportOutput } from './generateReportOutput'

export class ReportController {
  private taskQueue: TaskQueue<void>

  constructor(
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
      this.generateDailyAndCache.bind(this),
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

  async generateDailyAndCache() {
    this.logger.info('Daily report started')
    const report = await this.generateDaily()
    await this.cacheRepository.saveData(report)
    this.logger.info('Daily report saved')
  }

  async generateDaily() {
    let reports = await this.reportRepository.getDaily()
    reports = filterReportsByProjects(reports, this.projects)
    reports = getSufficientlySynced(reports)
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
    const reports = await this.reportRepository.getByProjectAndAsset(
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
