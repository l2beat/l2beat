import {
  DetailedTvlApiCharts,
  ProjectId,
  TvlApiChart,
  TvlApiChartPoint,
  TvlApiCharts,
  // TvlApiProjectsResponse,
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

export function generateTvlApiProjectsResponse(
  hourly: AggregatedReportRecord[],
  sixHourly: AggregatedReportRecord[],
  daily: AggregatedReportRecord[],
  projectIds: ProjectId[],
): DetailedTvlApiCharts {
  const reports = { hourly, sixHourly, daily }

  const _hourly: TvlApiChart = {
    types: ['timestamp', 'usd', 'eth'],
    data: [],
  }
  const _sixHourly: TvlApiChart = {
    types: ['timestamp', 'usd', 'eth'],
    data: [],
  }
  const _daily: TvlApiChart = {
    types: ['timestamp', 'usd', 'eth'],
    data: [],
  }

  const aggregateData = (
    tmpData: TvlApiChartPoint[],
    projectData: TvlApiChartPoint[],
  ): TvlApiChartPoint[] => {
    if (tmpData.length === 0) return projectData
    for (let i = 0; i < tmpData.length; i++) {
      // Skip first element which is timestamp, it should be the identical
      tmpData[i][1] += projectData[i][1]
      tmpData[i][2] += projectData[i][2]
    }
    return tmpData
  }

  for (const _projectId of projectIds) {
    const _projectChart = getProjectCharts(reports, _projectId)

    _hourly.data = aggregateData(_hourly.data, _projectChart.hourly.data)
    _sixHourly.data = aggregateData(
      _sixHourly.data,
      _projectChart.sixHourly.data,
    )
    _daily.data = aggregateData(_daily.data, _projectChart.daily.data)
    /*
    _hourly{
      data: [[timestamp(1), 1, 1], [timestamp(2), 2, 2]]
    }
    _projectChart.hourly{
      data: [timestamp(1), 11, 11], [timestamp(2), 22, 22], [timestamp(3), 33, 33]]
    }

    ...
    _hourly {
      data: [[timestamp(1), 12, 12], [timestamp(2), 24, 24]]
    }
    */
  }

  return {
    hourly: _hourly,
    sixHourly: _sixHourly,
    daily: _daily,
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
  return getChartPoints(balances, hours, 6, true)
}
