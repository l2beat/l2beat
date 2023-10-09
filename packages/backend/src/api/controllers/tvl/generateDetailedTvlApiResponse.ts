import {
  AggregatedReportType,
  assert,
  DetailedTvlApiChart,
  DetailedTvlApiChartPoint,
  DetailedTvlApiCharts,
  DetailedTvlApiResponse,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { sum } from 'lodash'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { covertBalancesToChartPoints } from './charts'
import {
  getProjectTokensCharts,
  ReportsPerProjectIdAndAsset,
  ReportsPerProjectIdAndTimestamp,
} from './detailedTvl'

export const DETAILED_LABELS: DetailedTvlApiChart['types'] = [
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

export function generateDetailedTvlApiResponse(
  hourlyReports: ReportsPerProjectIdAndTimestamp,
  sixHourlyReports: ReportsPerProjectIdAndTimestamp,
  dailyReports: ReportsPerProjectIdAndTimestamp,
  latestReports: ReportsPerProjectIdAndAsset,
  projectIds: ProjectId[],
): DetailedTvlApiResponse {
  const reports = {
    hourly: hourlyReports,
    sixHourly: sixHourlyReports,
    daily: dailyReports,
  }

  const layers2s = getProjectDetailedCharts(reports, ProjectId.LAYER2S)
  const bridges = getProjectDetailedCharts(reports, ProjectId.BRIDGES)
  const combined = getProjectDetailedCharts(reports, ProjectId.ALL)

  const projects = projectIds.reduce<DetailedTvlApiResponse['projects']>(
    (acc, projectId) => {
      acc[projectId.toString()] = {
        charts: getProjectDetailedCharts(reports, projectId),
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

export function generateDetailedAggregatedApiResponse(
  hourly: ReportsPerProjectIdAndTimestamp,
  sixHourly: ReportsPerProjectIdAndTimestamp,
  daily: ReportsPerProjectIdAndTimestamp,
  projectIds: ProjectId[],
): DetailedTvlApiCharts {
  const result: DetailedTvlApiCharts = createEmptyDetailedTvlApiCharts()

  // get project detailed charts of filtered projects (projectIds)

  const projectDetailedCharts = projectIds.map((projectId) => {
    return getProjectDetailedCharts(
      {
        hourly,
        sixHourly,
        daily,
      },
      projectId,
    )
  })

  // aggregate detailed charts

  const hourlyDataLength = projectDetailedCharts[0].hourly.data.length
  assert(
    projectDetailedCharts.every(
      (chart) => chart.hourly.data.length === hourlyDataLength,
    ),
    'hourly data length mismatch',
  )
  result.hourly.data = [...Array(hourlyDataLength).keys()].map((i) =>
    mergeDetailValues(
      projectDetailedCharts.map((projectChart) => projectChart.hourly.data[i]),
    ),
  )

  const sixHourlyDataLength = projectDetailedCharts[0].sixHourly.data.length
  assert(
    projectDetailedCharts.every(
      (chart) => chart.sixHourly.data.length === sixHourlyDataLength,
    ),
    'sixHourly data length mismatch',
  )
  result.sixHourly.data = [...Array(sixHourlyDataLength).keys()].map((i) =>
    mergeDetailValues(
      projectDetailedCharts.map(
        (projectChart) => projectChart.sixHourly.data[i],
      ),
    ),
  )

  const dailyDataLength = projectDetailedCharts[0].daily.data.length
  assert(
    projectDetailedCharts.every(
      (chart) => chart.daily.data.length === dailyDataLength,
    ),
    'daily data length mismatch',
  )
  result.daily.data = [...Array(dailyDataLength).keys()].map((i) =>
    mergeDetailValues(
      projectDetailedCharts.map((projectChart) => projectChart.daily.data[i]),
    ),
  )

  return result
}

function createEmptyDetailedTvlApiCharts(): DetailedTvlApiCharts {
  return {
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
}

function mergeDetailValues(
  values: DetailedTvlApiChartPoint[],
): DetailedTvlApiChartPoint {
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

export function getProjectDetailedCharts(
  reports: {
    hourly: ReportsPerProjectIdAndTimestamp
    sixHourly: ReportsPerProjectIdAndTimestamp
    daily: ReportsPerProjectIdAndTimestamp
  },
  projectId: ProjectId,
): DetailedTvlApiCharts {
  return {
    hourly: {
      types: DETAILED_LABELS,
      data: getProjectDetailedChartData(reports.hourly, projectId, 1),
    },
    sixHourly: {
      types: DETAILED_LABELS,
      data: getProjectDetailedChartData(reports.sixHourly, projectId, 6),
    },
    daily: {
      types: DETAILED_LABELS,
      data: getProjectDetailedChartData(reports.daily, projectId, 24),
    },
  }
}

export function getProjectDetailedChartData(
  reportTree: ReportsPerProjectIdAndTimestamp,
  projectId: ProjectId,
  resolutionInHours: number,
): DetailedTvlApiChartPoint[] {
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
