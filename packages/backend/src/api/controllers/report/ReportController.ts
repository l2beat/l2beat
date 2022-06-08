import { JobQueue, Logger } from '@l2beat/common'

import { ProjectInfo } from '../../../model/ProjectInfo'
import { CachedDataRepository } from '../../../peripherals/database/CachedDataRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { aggregateReportsDaily } from './aggregateReportsDaily'
import { filterReportsByProjects } from './filter/filterReportsByProjects'
import { getSufficientlySynced } from './filter/getSufficientlySynced'
import { generateReportOutput } from './generateReportOutput'

export class ReportController {
  private jobQueue: JobQueue

  constructor(
    private reportRepository: ReportRepository,
    private cacheRepository: CachedDataRepository,
    private projects: ProjectInfo[],
    private logger: Logger,
    private interval: number = 5 * 60 * 1000
  ) {
    this.jobQueue = new JobQueue({ maxConcurrentJobs: 1 }, this.logger)
  }

  start() {
    this.addJob()
    setInterval(() => this.addJob(), this.interval)
  }

  private addJob() {
    this.jobQueue.add({
      name: 'ReportController started @ ${UnixTime.now().toString()}',
      execute: () => this.generateDailyAndCache(),
    })
  }

  async getDaily() {
    return this.cacheRepository.getData()
  }

  async generateDailyAndCache() {
    const report = await this.generateDaily()
    await this.cacheRepository.saveData(report)
  }

  async generateDaily() {
    let reports = await this.reportRepository.getDaily()
    reports = filterReportsByProjects(reports, this.projects)
    reports = getSufficientlySynced(reports)
    const dailyEntries = aggregateReportsDaily(reports, this.projects)
    return generateReportOutput(dailyEntries, this.projects)
  }
}
