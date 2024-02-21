import {
  ProjectId,
  TvlApiChart,
  TvlApiChartPoint,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { AggregatedReportRecord } from '../repositories/AggregatedReportRepository'
import { ReportRecord } from '../repositories/ReportRepository'
import { asNumber } from './asNumber'
import { getProjectTokensCharts, groupByProjectAndReportType } from './tvl'

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

const USD_INDEX = {
  TVL: 1,
  CBV: 2,
  EBV: 3,
  NMV: 4,
}

const ETH_INDEX = {
  TVL: 5,
  CBV: 6,
  EBV: 7,
  NMV: 8,
}

const PERIODS = [
  ['hourly', 60 * 60],
  ['sixHourly', 6 * 60 * 60],
  ['daily', 24 * 60 * 60],
] as const

export function generateTvlApiResponse(
  hourlyReports: AggregatedReportRecord[],
  sixHourlyReports: AggregatedReportRecord[],
  dailyReports: AggregatedReportRecord[],
  latestReports: ReportRecord[],
  projects: { id: ProjectId; isLayer2: boolean; sinceTimestamp: UnixTime }[],
  untilTimestamp: UnixTime,
): TvlApiResponse {
  const charts = getEmptyCharts(projects, untilTimestamp)
  fillCharts(charts, hourlyReports, sixHourlyReports, dailyReports)

  const aggregates = getEmptyAggregates(projects, untilTimestamp)

  const groupedLatestReports = groupByProjectAndReportType(latestReports)

  const projectsResult = projects.reduce<TvlApiResponse['projects']>(
    (acc, project) => {
      acc[project.id.toString()] = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        charts: charts.get(project.id)!,
        tokens: getProjectTokensCharts(groupedLatestReports, project.id),
      }

      updateAggregates(project, aggregates, charts)

      return acc
    },
    {},
  )

  return {
    layers2s: aggregates.layers2s,
    bridges: aggregates.bridges,
    combined: aggregates.combined,
    projects: projectsResult,
  }
}

function updateAggregates(
  project: { id: ProjectId; isLayer2: boolean; sinceTimestamp: UnixTime },
  aggregates: {
    layers2s: TvlApiCharts
    bridges: TvlApiCharts
    combined: TvlApiCharts
  },
  charts: Map<ProjectId, TvlApiCharts>,
) {
  if (project.isLayer2) {
    aggregates.layers2s = mergeAggregates(
      aggregates.layers2s,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      charts.get(project.id)!,
    )
  } else {
    aggregates.bridges = mergeAggregates(
      aggregates.bridges,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      charts.get(project.id)!,
    )
  }

  aggregates.combined = mergeAggregates(
    aggregates.combined,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    charts.get(project.id)!,
  )
}

function getEmptyCharts(
  projects: { id: ProjectId; isLayer2: boolean; sinceTimestamp: UnixTime }[],
  untilTimestamp: UnixTime,
) {
  return new Map<ProjectId, TvlApiCharts>(
    projects.map((p) => [
      p.id,
      getEmptyChart(p.sinceTimestamp, untilTimestamp),
    ]),
  )
}

function getEmptyAggregates(
  projects: { id: ProjectId; isLayer2: boolean; sinceTimestamp: UnixTime }[],
  untilTimestamp: UnixTime,
) {
  const minLayer2Timestamp = projects
    .filter((p) => p.isLayer2)
    .map((x) => x.sinceTimestamp)
    .reduce((min, current) => UnixTime.min(min, current), untilTimestamp)

  const minBridgeTimestamp = projects
    .filter((p) => !p.isLayer2)
    .map((x) => x.sinceTimestamp)
    .reduce((min, current) => UnixTime.min(min, current), untilTimestamp)

  const minTimestamp = UnixTime.min(minLayer2Timestamp, minBridgeTimestamp)

  const aggregates = {
    layers2s: getEmptyChart(minLayer2Timestamp, untilTimestamp),
    bridges: getEmptyChart(minBridgeTimestamp, untilTimestamp),
    combined: getEmptyChart(minTimestamp, untilTimestamp),
  }
  return aggregates
}

// Function to sum two chart points with the same timestamp
function sumChartPoints(
  a: TvlApiChartPoint,
  b: TvlApiChartPoint,
): TvlApiChartPoint {
  return a.map((value, index) =>
    // @ts-expect-error first element should not be summed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-plus-operands
    index === 0 ? value : value + b[index],
  ) as TvlApiChartPoint
}

// This relies on an assumption that aggregate that first aggregate element is older or equal to first project element
// and on the fact that the interval between consecutive elements is the same
function mergeAndSumChartPoints(
  aggregate: TvlApiChartPoint[],
  project: TvlApiChartPoint[],
): TvlApiChartPoint[] {
  const id = aggregate.findIndex(
    (a) => a[0].toNumber() === project[0][0].toNumber(),
  )

  let ii = 0

  for (let i = id; i < aggregate.length; i++) {
    aggregate[i] = sumChartPoints(aggregate[i], project[ii])
    ii++
  }

  return aggregate
}

function mergeCharts(a: TvlApiChart, b: TvlApiChart): TvlApiChart {
  return {
    types: a.types, // Assuming types are constant and identical
    data: mergeAndSumChartPoints(a.data, b.data),
  }
}

function mergeAggregates(
  aggregates: TvlApiCharts,
  projectCharts: TvlApiCharts,
): TvlApiCharts {
  return {
    hourly: mergeCharts(aggregates.hourly, projectCharts.hourly),
    sixHourly: mergeCharts(aggregates.sixHourly, projectCharts.sixHourly),
    daily: mergeCharts(aggregates.daily, projectCharts.daily),
  }
}

function getEmptyChart(
  sinceTimestamp: UnixTime,
  untilTimestamp: UnixTime,
): TvlApiCharts {
  return {
    hourly: {
      types: TYPE_LABELS,
      data: generateZeroes(
        UnixTime.max(
          sinceTimestamp,
          untilTimestamp.add(-7, 'days').add(1, 'hours'),
        ),
        untilTimestamp,
        1,
      ),
    },
    sixHourly: {
      types: TYPE_LABELS,
      data: generateZeroes(
        UnixTime.max(
          sinceTimestamp,
          untilTimestamp.add(-90, 'days').add(6, 'hours'),
        ),
        untilTimestamp,
        6,
      ),
    },
    daily: {
      types: TYPE_LABELS,
      data: generateZeroes(sinceTimestamp, untilTimestamp, 24),
    },
  }
}

function fillCharts(
  charts: Map<ProjectId, TvlApiCharts>,
  hourlyReports: AggregatedReportRecord[],
  sixHourlyReports: AggregatedReportRecord[],
  dailyReports: AggregatedReportRecord[],
) {
  const reports = {
    hourly: hourlyReports,
    sixHourly: sixHourlyReports,
    daily: dailyReports,
  }

  for (const [period, singleOffset] of PERIODS) {
    for (const report of reports[period]) {
      const apiCharts = charts.get(report.projectId)
      if (!apiCharts) {
        continue
      }

      const minTimestamp = apiCharts[period].data[0][0]
      const index =
        (report.timestamp.toNumber() - minTimestamp.toNumber()) / singleOffset

      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= apiCharts[period].data.length
      ) {
        continue
      }

      const point = apiCharts[period].data[index]
      point[USD_INDEX[report.reportType]] = asNumber(report.usdValue, 2)
      point[ETH_INDEX[report.reportType]] = asNumber(report.ethValue, 6)
    }
  }
}

function generateZeroes(
  since: UnixTime,
  until: UnixTime,
  offsetHours: number,
): TvlApiChartPoint[] {
  const adjusted = new UnixTime(
    since.toNumber() - (since.toNumber() % (offsetHours * 60 * 60)),
  )

  const zeroes: TvlApiChartPoint[] = []
  for (
    let timestamp = adjusted;
    timestamp.lte(until);
    timestamp = timestamp.add(offsetHours, 'hours')
  ) {
    zeroes.push([timestamp, 0, 0, 0, 0, 0, 0, 0, 0])
  }
  return zeroes
}
