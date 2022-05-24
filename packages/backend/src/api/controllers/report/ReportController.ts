import { ProjectInfo } from '../../../model/ProjectInfo'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { aggregateReportsDaily } from './aggregateReportsDaily'
import { filterReportsByProjects } from './filter/filterReportsByProjects'
import { getSufficientlySynced } from './filter/getSufficientlySynced'
import { generateReportOutput } from './generateReportOutput'

export class ReportController {
  constructor(
    private reportRepository: ReportRepository,
    private projects: ProjectInfo[]
  ) {}

  async getDaily() {
    let reports = await this.reportRepository.getDaily()
    reports = filterReportsByProjects(reports, this.projects)
    reports = getSufficientlySynced(reports)
    const dailyEntries = aggregateReportsDaily(reports, this.projects)
    return generateReportOutput(dailyEntries, this.projects)
  }
}
