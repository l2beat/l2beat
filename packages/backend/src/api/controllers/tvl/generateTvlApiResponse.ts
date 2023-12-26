import {
  AggregatedReportType,
  assert,
  ProjectId,
  TvlApiChart,
  TvlApiChartPoint,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'
import { sum } from 'lodash'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { covertBalancesToChartPoints } from './charts'
import {
  getProjectTokensCharts,
  ReportsPerProjectIdAndAsset,
  ReportsPerProjectIdAndTimestamp,
} from './tvl'

export const TYPE_LABELS: TvlApiChart['types'] = [
  'timestamp',
  'valueUsd',
  'cbvUsd',
  'ebvUsd',
  'nmvUsd',
  'valueEth',
  'cbvEth',
  'ebvEth',
  'nmvEth',
]

export function generateTvlApiResponse(
  hourlyReports: ReportsPerProjectIdAndTimestamp,
  sixHourlyReports: ReportsPerProjectIdAndTimestamp,
  dailyReports: ReportsPerProjectIdAndTimestamp,
  latestReports: ReportsPerProjectIdAndAsset,
  projectIds: ProjectId[],
): TvlApiResponse {
  const reports = {
    hourly: hourlyReports,
    sixHourly: sixHourlyReports,
    daily: dailyReports,
  }

  const layers2s = getProjectCharts(reports, ProjectId.LAYER2S)
  const bridges = getProjectCharts(reports, ProjectId.BRIDGES)
  const combined = getProjectCharts(reports, ProjectId.ALL)

  const projects = projectIds.reduce<TvlApiResponse['projects']>(
    (acc, projectId) => {
      acc[projectId.toString()] = {
        charts: getProjectCharts(reports, projectId),
        tokens: getProjectTokensCharts(latestReports, projectId),
      }
      return acc
    },
    {},
  )

  return {
    layers2s,
    bridges,
    combined,
    projects,
  }
}

export function generateAggregatedTvlApiResponse(
  hourly: ReportsPerProjectIdAndTimestamp,
  sixHourly: ReportsPerProjectIdAndTimestamp,
  daily: ReportsPerProjectIdAndTimestamp,
  projectIds: ProjectId[],
): TvlApiCharts {
  const result: TvlApiCharts = createEmptyTvlApiCharts()

  // get project charts of filtered projects (projectIds)

  const projectCharts = projectIds.map((projectId) => {
    return getProjectCharts(
      {
        hourly,
        sixHourly,
        daily,
      },
      projectId,
    )
  })

  // aggregate charts

  const hourlyDataLength = projectCharts[0].hourly.data.length
  assert(
    projectCharts.every(
      (chart) => chart.hourly.data.length === hourlyDataLength,
    ),
    'hourly data length mismatch',
  )
  result.hourly.data = [...Array(hourlyDataLength).keys()].map((i) =>
    mergeDetailValues(
      projectCharts.map((projectChart) => projectChart.hourly.data[i]),
    ),
  )

  const sixHourlyDataLength = projectCharts[0].sixHourly.data.length
  assert(
    projectCharts.every(
      (chart) => chart.sixHourly.data.length === sixHourlyDataLength,
    ),
    'sixHourly data length mismatch',
  )
  result.sixHourly.data = [...Array(sixHourlyDataLength).keys()].map((i) =>
    mergeDetailValues(
      projectCharts.map((projectChart) => projectChart.sixHourly.data[i]),
    ),
  )

  const dailyDataLength = projectCharts[0].daily.data.length
  assert(
    projectCharts.every((chart) => chart.daily.data.length === dailyDataLength),
    'daily data length mismatch',
  )
  result.daily.data = [...Array(dailyDataLength).keys()].map((i) =>
    mergeDetailValues(
      projectCharts.map((projectChart) => projectChart.daily.data[i]),
    ),
  )

  return result
}

function createEmptyTvlApiCharts(): TvlApiCharts {
  return {
    hourly: {
      types: TYPE_LABELS,
      data: [],
    },
    sixHourly: {
      types: TYPE_LABELS,
      data: [],
    },
    daily: { types: TYPE_LABELS, data: [] },
  }
}

function mergeDetailValues(values: TvlApiChartPoint[]): TvlApiChartPoint {
  return [
    values[0][0],
    sum(values.map((value) => value[1])),
    sum(values.map((value) => value[2])),
    sum(values.map((value) => value[3])),
    sum(values.map((value) => value[4])),
    sum(values.map((value) => value[5])),
    sum(values.map((value) => value[6])),
    sum(values.map((value) => value[7])),
    sum(values.map((value) => value[8])),
  ]
}

export function getProjectCharts(
  reports: {
    hourly: ReportsPerProjectIdAndTimestamp
    sixHourly: ReportsPerProjectIdAndTimestamp
    daily: ReportsPerProjectIdAndTimestamp
  },
  projectId: ProjectId,
): TvlApiCharts {
  return {
    hourly: {
      types: TYPE_LABELS,
      data: getProjectChartData(reports.hourly, projectId, 1),
    },
    sixHourly: {
      types: TYPE_LABELS,
      data: getProjectChartData(reports.sixHourly, projectId, 6),
    },
    daily: {
      types: TYPE_LABELS,
      data: getProjectChartData(reports.daily, projectId, 24),
    },
  }
}

export function getProjectChartData(
  reportTree: ReportsPerProjectIdAndTimestamp,
  projectId: ProjectId,
  resolutionInHours: number,
): TvlApiChartPoint[] {
  const projectReportsByTimestamp = reportTree[projectId.toString()]

  // Project may be missing reports
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!projectReportsByTimestamp) {
    return []
  }

  const balancesInTime = Object.entries(projectReportsByTimestamp).map(
    ([timestamp, valueReports]) => {
      const { tvlReport, cbvReport, ebvReport, nmvReport } =
        extractReportTypeSet(valueReports)

      return {
        timestamp: new UnixTime(Number(timestamp)),
        usdTvl: tvlReport.usdValue,
        ethTvl: tvlReport.ethValue,
        usdCbv: cbvReport.usdValue,
        ethCbv: cbvReport.ethValue,
        usdEbv: ebvReport.usdValue,
        ethEbv: ebvReport.ethValue,
        usdNmv: nmvReport.usdValue,
        ethNmv: nmvReport.ethValue,
      }
    },
  )

  return covertBalancesToChartPoints(balancesInTime, resolutionInHours, 6, true)
}

export function extractReportTypeSet(reports: AggregatedReportRecord[]) {
  const typesToSeek: AggregatedReportType[] = ['TVL', 'CBV', 'EBV', 'NMV']

  const defaultValue = {
    usdValue: 0n,
    ethValue: 0n,
  }

  const fillMissingReportValues = getReportValuesOr(defaultValue)

  const [tvlReport, cbvReport, ebvReport, nmvReport] = typesToSeek
    .map((requestedReportType) =>
      reports.find(({ reportType }) => reportType === requestedReportType),
    )
    .map(fillMissingReportValues)

  return {
    tvlReport,
    cbvReport,
    ebvReport,
    nmvReport,
  }
}

function getReportValuesOr(fallback: { usdValue: bigint; ethValue: bigint }) {
  return function (report?: AggregatedReportRecord) {
    return {
      usdValue: report?.usdValue ?? fallback.usdValue,
      ethValue: report?.ethValue ?? fallback.ethValue,
    }
  }
}
