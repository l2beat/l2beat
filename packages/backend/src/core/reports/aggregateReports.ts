import { UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../model'
import { AggregateReportRecord } from '../../peripherals/database/AggregateReportRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'

export function aggregateReports(
  reports: ReportRecord[],
  projects: ProjectInfo[],
  timestamp: UnixTime,
): AggregateReportRecord[] {
  const aggregateReports: AggregateReportRecord[] = []
  for (const project of projects) {
    const filteredReports = reports.filter(
      (x) => x.projectId === project.projectId,
    )
    const { tvlEth, tvlUsd } = filteredReports.reduce(
      (acc, next) => ({
        tvlUsd: acc.tvlUsd + next.balanceUsd,
        tvlEth: acc.tvlEth + next.balanceEth,
      }),
      { tvlUsd: 0n, tvlEth: 0n },
    )
    aggregateReports.push({
      timestamp,
      projectId: project.projectId,
      tvlEth,
      tvlUsd,
    })
  }

  return aggregateReports
}
