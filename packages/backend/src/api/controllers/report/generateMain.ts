import { ApiMain, ChartPoint, ProjectId } from '@l2beat/common'

import { addMissingDailyTimestamps } from '../../../core/reports/charts'
import { ProjectInfo } from '../../../model'
import { AggregateReportRecord } from '../../../peripherals/database/AggregateReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'

export function generateMain(
  aggregateReports: AggregateReportRecord[],
  latestRecords: ReportRecord[],
  projects: ProjectInfo[],
): ApiMain {
  const apiMain: ApiMain = {
    charts: {
      daily: {
        types: ['timestamp', 'usd', 'eth'],
        data: getProjectDailyChartData(aggregateReports, ProjectId.ALL),
      },
    },
    projects: {},
  }

  for (const { name, projectId } of projects) {
    apiMain.projects[name] = {
      charts: {
        daily: {
          types: ['timestamp', 'usd', 'eth'],
          data: getProjectDailyChartData(aggregateReports, projectId),
        },
      },
      tokens: latestRecords
        .filter((r) => r.projectId === projectId)
        .map((r) => ({ assetId: r.asset, tvl: asNumber(r.balanceUsd, 2) })),
    }
  }

  return apiMain
}

function getProjectDailyChartData(
  reports: AggregateReportRecord[],
  projectId: ProjectId,
): ChartPoint[] {
  const existing: ChartPoint[] = reports
    .filter((r) => r.projectId === projectId)
    .map((r) => [r.timestamp, asNumber(r.tvlUsd, 2), asNumber(r.tvlEth, 6)])
  return addMissingDailyTimestamps(existing)
}
