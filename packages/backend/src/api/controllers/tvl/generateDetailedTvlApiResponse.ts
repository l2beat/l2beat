import {
  AggregatedReportType,
  DetailedTvlApiChart,
  DetailedTvlApiChartPoint,
  DetailedTvlApiCharts,
  DetailedTvlApiResponse,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

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

  const mergeDetailValues = (
    first: DetailedTvlApiChartPoint,
    second: DetailedTvlApiChartPoint | undefined,
  ): DetailedTvlApiChartPoint => {
    if (!second) return first
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

  const firstProjectDetailedCharts = projectDetailedCharts[0]
  result.hourly.types = firstProjectDetailedCharts.hourly.types
  result.sixHourly.types = firstProjectDetailedCharts.sixHourly.types
  result.daily.types = firstProjectDetailedCharts.daily.types

  result.hourly.data = firstProjectDetailedCharts.hourly.data
  result.sixHourly.data = firstProjectDetailedCharts.sixHourly.data
  result.daily.data = firstProjectDetailedCharts.daily.data

  projectDetailedCharts.slice(1).forEach((projectChart) => {
    result.hourly.data = result.hourly.data.map((point, index) =>
      mergeDetailValues(point, projectChart.hourly.data[index]),
    )
    result.sixHourly.data = result.sixHourly.data.map((point, index) =>
      mergeDetailValues(point, projectChart.sixHourly.data[index]),
    )
    result.daily.data = result.daily.data.map((point, index) =>
      mergeDetailValues(point, projectChart.daily.data[index]),
    )
  })

  return result
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
