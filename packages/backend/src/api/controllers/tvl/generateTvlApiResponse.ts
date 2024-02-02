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
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { covertBalancesToChartPoints } from './charts'
import {
  getProjectTokensCharts,
  groupByProjectIdAndAssetType,
  groupByProjectIdAndTimestamp,
  ReportsPerProjectIdAndTimestamp,
} from './tvl'
import { asNumber } from './asNumber'

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
  hourlyReports: AggregatedReportRecord[],
  sixHourlyReports: AggregatedReportRecord[],
  dailyReports: AggregatedReportRecord[],
  latestReports: ReportRecord[],
  projects: { id: ProjectId; isLayer2: boolean; sinceTimestamp: UnixTime }[],
  untilTimestamp: UnixTime,
): TvlApiResponse {
  const charts = new Map<ProjectId, TvlApiCharts>()

  function generateZeroes(
    since: UnixTime,
    until: UnixTime,
    offsetHours: number,
  ): TvlApiChartPoint[] {
    const zeroes = []
    for (
      let timestamp = since;
      timestamp.lte(until);
      timestamp = timestamp.add(offsetHours, 'hours')
    ) {
      zeroes.push([timestamp, 0, 0, 0, 0, 0, 0, 0, 0] as TvlApiChartPoint)
    }
    return zeroes
  }

  const minLayer2Timestamp = projects
    .filter((p) => p.isLayer2)
    .map((x) => x.sinceTimestamp)
    .reduce((min, current) => (min.lt(current) ? min : current), untilTimestamp)

  const minBridgeTimestamp = projects
    .filter((p) => !p.isLayer2)
    .map((x) => x.sinceTimestamp)
    .reduce((min, current) => (min.lt(current) ? min : current), untilTimestamp)

  const minTimestamp = minLayer2Timestamp.lt(minBridgeTimestamp)
    ? minLayer2Timestamp
    : minBridgeTimestamp

  const extendedProjects = [
    { id: ProjectId.LAYER2S, sinceTimestamp: minLayer2Timestamp },
    { id: ProjectId.BRIDGES, sinceTimestamp: minBridgeTimestamp },
    { id: ProjectId.ALL, sinceTimestamp: minTimestamp },
  ]

  for (const { id, sinceTimestamp } of extendedProjects.concat(projects)) {
    charts.set(id, {
      daily: {
        types: TYPE_LABELS,
        data: generateZeroes(
          sinceTimestamp.toStartOf('day'),
          untilTimestamp,
          24,
        ),
      },
      hourly: {
        types: TYPE_LABELS,
        data: generateZeroes(
          sinceTimestamp.toStartOf('hour'),
          untilTimestamp,
          60,
        ),
      },
      sixHourly: {
        types: TYPE_LABELS,
        data: generateZeroes(
          sinceTimestamp.toStartOf('six hours'),
          untilTimestamp,
          60,
        ),
      },
    })
  }

  const usdIndex = {
    TVL: 1,
    CBV: 2,
    EBV: 3,
    NMV: 4,
  }

  const ethIndex = {
    TVL: 5,
    CBV: 6,
    EBV: 7,
    NMV: 8,
  }

  for (const report of hourlyReports) {
    const apiCharts = charts.get(report.projectId)
    if (!apiCharts) {
      continue
    }
    const minTimestamp = apiCharts.hourly.data[0][0]
    const offset =
      (report.timestamp.toNumber() - minTimestamp.toNumber()) / (60 * 60)
    if (
      !Number.isInteger(offset) ||
      offset < 0 ||
      offset >= apiCharts.hourly.data.length
    ) {
      continue
    }

    const point = apiCharts.hourly.data[offset]
    point[usdIndex[report.reportType]] = asNumber(report.usdValue, 2)
    point[ethIndex[report.reportType]] = asNumber(report.ethValue, 6)
  }

  /**
   * ProjectID => Timestamp => [Report, Report, Report, Report]
   * Ideally 4 reports per project per timestamp corresponding to 4 Value Types
   */
  const groupedHourlyReports = groupByProjectIdAndTimestamp(hourlyReports)

  const groupedSixHourlyReportsTree =
    groupByProjectIdAndTimestamp(sixHourlyReports)

  const groupedDailyReports = groupByProjectIdAndTimestamp(dailyReports)

  /**
   * ProjectID => Asset => Report[]
   * Ideally 1 report. Some chains like Arbitrum may have multiple reports per asset differentiated by Value Type
   * That isl 1 report for USDC of value type CBV and 1 report for USDC of value type EBV
   * Reduce (dedupe) occurs later in the call chain
   * @see getProjectTokensCharts
   */
  const groupedLatestReports = groupByProjectIdAndAssetType(latestReports)

  const reports = {
    hourly: groupedHourlyReports,
    sixHourly: groupedSixHourlyReportsTree,
    daily: groupedDailyReports,
  }

  const layers2s = getProjectCharts(reports, ProjectId.LAYER2S)
  const bridges = getProjectCharts(reports, ProjectId.BRIDGES)
  const combined = getProjectCharts(reports, ProjectId.ALL)

  const projectsResult = projects.reduce<TvlApiResponse['projects']>(
    (acc, { id }) => {
      acc[id.toString()] = {
        charts: getProjectCharts(reports, id),
        tokens: getProjectTokensCharts(groupedLatestReports, id),
      }
      return acc
    },
    {},
  )

  return {
    layers2s,
    bridges,
    combined,
    projects: projectsResult,
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
