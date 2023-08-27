import {
  ProjectId,
  TvlApiChart,
  TvlApiChartPoint,
  TvlApiCharts,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'
import { getChartPoints } from './charts'

export function generateTvlApiResponse(
  hourly: AggregatedReportRecord[],
  sixHourly: AggregatedReportRecord[],
  daily: AggregatedReportRecord[],
  latestReports: ReportRecord[],
  projectIds: ProjectId[],
): TvlApiResponse {
  const reports = { hourly, sixHourly, daily }
  return {
    layers2s: getProjectCharts(reports, ProjectId.LAYER2S),
    bridges: getProjectCharts(reports, ProjectId.BRIDGES),
    combined: getProjectCharts(reports, ProjectId.ALL),
    projects: projectIds.reduce<TvlApiResponse['projects']>(
      (acc, projectId) => {
        acc[projectId.toString()] = {
          charts: getProjectCharts(reports, projectId),
          tokens: latestReports
            .filter((r) => r.projectId === projectId)
            .map((r) => ({ assetId: r.asset, tvl: asNumber(r.usdValue, 2) })),
        }
        return acc
      },
      {},
    ),
  }
}

function getProjectCharts(
  reports: {
    hourly: AggregatedReportRecord[]
    sixHourly: AggregatedReportRecord[]
    daily: AggregatedReportRecord[]
  },
  projectId: ProjectId,
): TvlApiCharts {
  const types: TvlApiChart['types'] = ['timestamp', 'usd', 'eth']
  return {
    hourly: {
      types,
      data: getProjectChartData(reports.hourly, projectId, 1),
    },
    sixHourly: {
      types,
      data: getProjectChartData(reports.sixHourly, projectId, 6),
    },
    daily: {
      types: types,
      data: getProjectChartData(reports.daily, projectId, 24),
    },
  }
}

function getProjectChartData(
  reports: AggregatedReportRecord[],
  projectId: ProjectId,
  hours: number,
): TvlApiChartPoint[] {
  const balances = reports
    .filter((r) => r.projectId === projectId)
    .map((r) => ({
      timestamp: r.timestamp,
      usd: r.usdValue,
      asset: r.ethValue,
    }))
  return getChartPoints(balances, hours, true)
}
