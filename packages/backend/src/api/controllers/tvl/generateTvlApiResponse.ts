import {
  AggregatedReportType,
  ProjectId,
  TvlApiChart,
  TvlApiChartPoint,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

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
