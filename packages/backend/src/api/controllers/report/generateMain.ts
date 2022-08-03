import { ApiMain, ChartPoint, ProjectId } from '@l2beat/common'

import { addMissingDailyTimestamps } from '../../../core/reports/charts'
import { ProjectInfo } from '../../../model'
import { AggregateReportRecord } from '../../../peripherals/database/AggregateReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'

export function generateMain(
  aggregateReports: AggregateReportRecord[],
  latestReports: ReportRecord[],
  projects: ProjectInfo[],
): ApiMain {
  return {
    charts: {
      daily: {
        types: ['timestamp', 'usd', 'eth'],
        data: getProjectDailyChartData(aggregateReports, ProjectId.ALL),
      },
    },
    projects: projects.reduce<ApiMain['projects']>(
      (acc, { name, projectId }) => {
        acc[name] = {
          charts: {
            daily: {
              types: ['timestamp', 'usd', 'eth'],
              data: getProjectDailyChartData(aggregateReports, projectId),
            },
          },
          tokens: latestReports
            .filter((r) => r.projectId === projectId)
            .map((r) => ({ assetId: r.asset, tvl: asNumber(r.balanceUsd, 2) })),
        }
        return acc
      },
      {},
    ),
  }
}

function getProjectDailyChartData(
  reports: AggregateReportRecord[],
  projectId: ProjectId,
): ChartPoint[] {
  const existing: ChartPoint[] = reports
    .filter((r) => r.projectId === projectId)
    .map((r) => [
      // we subtract a day so that the date represents the end of that day
      r.timestamp.add(-1, 'days').toStartOf('day'),
      asNumber(r.tvlUsd, 2),
      asNumber(r.tvlEth, 6),
    ])
  return addMissingDailyTimestamps(existing)
}
