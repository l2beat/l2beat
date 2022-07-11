import { ApiMain, Logger, TaskQueue } from '@l2beat/common'

import { ProjectInfo } from '../../../model/ProjectInfo'
import { CachedDataRepository } from '../../../peripherals/database/CachedDataRepository'
import { PriceRepository } from '../../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { addOptimismToken, addOptimismTokenV2 } from './addOptimismToken'
import {
  aggregateReportsDaily,
  aggregateReportsDailyV2,
} from './aggregateReportsDaily'
import { filterReportsByProjects } from './filter/filterReportsByProjects'
import { getSufficientlySynced } from './filter/getSufficientlySynced'
import { generateApiMain, generateReportOutput } from './generateReportOutput'

export class ReportController {
  private taskQueue: TaskQueue<void>

  constructor(
    private reportRepository: ReportRepository,
    private cacheRepository: CachedDataRepository,
    private priceRepository: PriceRepository,
    private projects: ProjectInfo[],
    private logger: Logger,
    private interval: number = 5 * 60 * 1000,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(async () => {
      await Promise.all([this.generateDailyAndCache(), this.generateMain()])
    }, this.logger)
  }

  start() {
    this.taskQueue.addIfEmpty()
    setInterval(() => this.taskQueue.addIfEmpty(), this.interval)
  }

  async getDaily() {
    return this.cacheRepository.getData()
  }

  async getMain() {
    return this.cacheRepository.getMain()
  }

  async generateMainAndCache() {
    this.logger.info('Main started')
    const main = await this.generateMain()
    await this.cacheRepository.saveMain(main)
    this.logger.info('Main saved')
  }

  async generateMain(): Promise<ApiMain> {
    let reports = await this.reportRepository.getDaily()
    reports = filterReportsByProjects(reports, this.projects)
    reports = getSufficientlySynced(reports)
    const dailyEntries = aggregateReportsDailyV2(reports, this.projects)
    await addOptimismTokenV2(dailyEntries, this.priceRepository)
    return generateApiMain(dailyEntries, this.projects)
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
}
