import {
  DetailedTvlApiChartPoint,
  DetailedTvlApiCharts,
  ProjectId,
  TvlApiChart,
  TvlApiChartPoint,
  TvlApiCharts,
  // TvlApiProjectsResponse,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy, toNumber } from 'lodash'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'
import { getChartPoints } from './charts'
import { groupByProjectIdAndTimestamp } from './detailedTvl'
import {
  DETAILED_LABELS,
  getProjectDetailedCharts,
} from './generateDetailedTvlApiResponse'

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

export function generateAggregatedApiResponse(
  hourly: AggregatedReportRecord[],
  sixHourly: AggregatedReportRecord[],
  daily: AggregatedReportRecord[],
  projectIds: ProjectId[],
): DetailedTvlApiCharts {
  const groupByTimestamp = (reports: AggregatedReportRecord[]) => {
    return groupBy(reports, (report) => report.timestamp)
  }

  const result: DetailedTvlApiCharts = {
    hourly: {
      types: DETAILED_LABELS,
      data: [],
    },
    sixHourly: {
      types: DETAILED_LABELS,
      data: [],
    },
    daily: { types: DETAILED_LABELS, data: [] },
  }

  const hourlyGroupedByTimestamp = groupByTimestamp(hourly)
  const sixHourlyGroupedByTimestamp = groupByTimestamp(sixHourly)
  const dailyGroupedByTimestamp = groupByTimestamp(daily)

  const mergeDetailValues = (
    first: DetailedTvlApiChartPoint,
    second: DetailedTvlApiChartPoint | undefined,
  ): DetailedTvlApiChartPoint => {
    if (!second) return first;
    return [
      first[0],
      first[1] + second[1],
      first[2] + second[2],
      first[3] + second[3],
      first[4] + second[4],
      first[5] + second[5],
      first[6] + second[6],
      first[7] + second[7],
      first[8] + second[8],
    ]
  }

  for (const timestamp in hourlyGroupedByTimestamp) {
    const _hourlyTimestamp = groupByProjectIdAndTimestamp(
      hourlyGroupedByTimestamp[timestamp],
    )
    const _sixHourlyTimestamp = groupByProjectIdAndTimestamp(
      sixHourlyGroupedByTimestamp[timestamp],
    )
    const _dailyTimestamp = groupByProjectIdAndTimestamp(
      dailyGroupedByTimestamp[timestamp],
    )

    let hourlyValue: DetailedTvlApiChartPoint = [
      new UnixTime(toNumber(timestamp)),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]
    let sixHourlyValue: DetailedTvlApiChartPoint = [
      new UnixTime(toNumber(timestamp)),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]
    let dailyValue: DetailedTvlApiChartPoint = [
      new UnixTime(toNumber(timestamp)),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]

    projectIds
      .map((projectId) => {
        return getProjectDetailedCharts(
          {
            hourly: _hourlyTimestamp,
            sixHourly: _sixHourlyTimestamp,
            daily: _dailyTimestamp,
          },
          projectId,
        )
      })
      .forEach((projectChart) => {
        hourlyValue = mergeDetailValues(
          hourlyValue,
          projectChart.hourly.data[0],
        )
        sixHourlyValue = mergeDetailValues(
          sixHourlyValue,
          projectChart.sixHourly.data[0],
        )
        dailyValue = mergeDetailValues(dailyValue, projectChart.daily.data[0])
      })

    result.hourly.data.push(hourlyValue)
    result.sixHourly.data.push(sixHourlyValue)
    result.daily.data.push(dailyValue)
  }

  return result
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
