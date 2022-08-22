import { ApiMain, Chart, ChartPoint, Charts, ProjectId } from '@l2beat/types'

import { ProjectInfo } from '../../../model'
import { AggregateReportRecord } from '../../../peripherals/database/AggregateReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'
import { getChartPoints } from './charts'

export function generateMain(
  hourlyReports: AggregateReportRecord[],
  sixHourlyReports: AggregateReportRecord[],
  dailyReports: AggregateReportRecord[],
  latestReports: ReportRecord[],
  projects: ProjectInfo[],
): ApiMain {
  return {
    charts: getProjectCharts(
      hourlyReports,
      sixHourlyReports,
      dailyReports,
      ProjectId.ALL,
    ),
    projects: projects.reduce<ApiMain['projects']>((acc, { projectId }) => {
      acc[projectId.toString()] = {
        charts: getProjectCharts(
          hourlyReports,
          sixHourlyReports,
          dailyReports,
          projectId,
        ),
        tokens: latestReports
          .filter((r) => r.projectId === projectId)
          .map((r) => ({ assetId: r.asset, tvl: asNumber(r.balanceUsd, 2) })),
      }
      return acc
    }, {}),
  }
}

function getProjectCharts(
  hourlyReports: AggregateReportRecord[],
  sixHourlyReports: AggregateReportRecord[],
  dailyReports: AggregateReportRecord[],
  projectId: ProjectId,
): Charts {
  const types: Chart['types'] = ['timestamp', 'usd', 'eth']
  return {
    hourly: {
      types,
      data: getProjectChartData(hourlyReports, projectId, 1),
    },
    sixHourly: {
      types,
      data: getProjectChartData(sixHourlyReports, projectId, 6),
    },
    daily: {
      types: types,
      data: getProjectChartData(dailyReports, projectId, 24),
    },
  }
}

function getProjectChartData(
  reports: AggregateReportRecord[],
  projectId: ProjectId,
  hours: number,
): ChartPoint[] {
  const balances = reports
    .filter((r) => r.projectId === projectId)
    .map((r) => ({
      timestamp: r.timestamp,
      usd: r.tvlUsd,
      asset: r.tvlEth,
    }))
  return getChartPoints(balances, hours, 6, true)
}
