import { ProjectId, UnixTime } from '@l2beat/types'

import { ProjectInfo } from '../../model'
import { AggregateReportRecord } from '../../peripherals/database/AggregateReportRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'

export function aggregateReports(
  reports: ReportRecord[],
  projects: ProjectInfo[],
  timestamp: UnixTime,
): AggregateReportRecord[] {
  const aggregateReports: AggregateReportRecord[] = []
  let tvlAllUsd = 0n
  let tvlAllEth = 0n

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
    tvlAllEth += tvlEth
    tvlAllUsd += tvlUsd
  }

  aggregateReports.push({
    timestamp,
    projectId: ProjectId.ALL,
    tvlEth: tvlAllEth,
    tvlUsd: tvlAllUsd,
  })

  return aggregateReports
}
