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
    const reports = await this.reportRepository.getDaily()
    const relevantReports = filterReportsByProjects(reports, this.projects)
    const syncedReports = getSufficientlySynced(relevantReports)
    const dailyEntries = aggregateReportsDaily(syncedReports, this.projects)
    return generateReportOutput(dailyEntries, this.projects)
  }
}
