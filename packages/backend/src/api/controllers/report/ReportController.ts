import { JobQueue, Logger } from '@l2beat/common'
import fs from 'fs'

import { ProjectInfo } from '../../../model/ProjectInfo'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { aggregateReportsDaily } from './aggregateReportsDaily'
import { filterReportsByProjects } from './filter/filterReportsByProjects'
import { getSufficientlySynced } from './filter/getSufficientlySynced'
import { generateReportOutput, ReportOutput } from './generateReportOutput'

export class ReportController {
  private jobQueue: JobQueue

  constructor(
    private reportRepository: ReportRepository,
    private projects: ProjectInfo[],
    private logger: Logger,
    private interval: number = 5 * 60 * 1000
  ) {
    this.jobQueue = new JobQueue({ maxConcurrentJobs: 1 }, this.logger)
  }

  start() {
    this.jobQueue.add({
      name: 'ReportController started @ ${UnixTime.now().toString()}',
      execute: () => this.generateDailyAndCache(),
    })

    setInterval(
      () =>
        this.jobQueue.add({
          name: 'ReportController started @ ${UnixTime.now().toString()}',
          execute: () => this.generateDailyAndCache(),
        }),
      this.interval
    )
  }

  async getDaily() {
    const report = await getCachedReport()
    return report
  }

  async generateDailyAndCache() {
    const report = await this.generateDaily()
    await saveReport(report)
  }

  async generateDaily() {
    let reports = await this.reportRepository.getDaily()
    reports = filterReportsByProjects(reports, this.projects)
    reports = getSufficientlySynced(reports)
    const dailyEntries = aggregateReportsDaily(reports, this.projects)
    return generateReportOutput(dailyEntries, this.projects)
  }
}

async function saveReport(report: ReportOutput) {
  if (!fs.existsSync('./cache')) {
    await fs.promises.mkdir('./cache')
  }
  await fs.promises.writeFile(
    './cache/data.json',
    JSON.stringify(report),
    'utf-8'
  )
}

async function getCachedReport(): Promise<string | undefined> {
  if (!fs.existsSync('./cache/data.json')) {
    return undefined
  }

  const report = await fs.promises.readFile('./cache/data.json', {
    encoding: 'utf-8',
  })

  return report
}
