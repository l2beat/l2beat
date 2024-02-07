import {
  ProjectId,
  TvlApiChart,
  TvlApiChartPoint,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'
import { getProjectTokensCharts, groupByProjectIdAndAssetType } from './tvl'

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
  const charts = new Map<ProjectId, TvlApiCharts>()

  const extendedProjects = getExtendedProjects(projects, untilTimestamp)

  for (const { id, sinceTimestamp } of extendedProjects.concat(projects)) {
    charts.set(id, {
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
    })
  }

  fillCharts(charts, hourlyReports, sixHourlyReports, dailyReports)

  const groupedLatestReports = groupByProjectIdAndAssetType(latestReports)
  const projectsResult = projects.reduce<TvlApiResponse['projects']>(
    (acc, project) => {
      acc[project.id.toString()] = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        charts: charts.get(project.id)!,
        tokens: getProjectTokensCharts(groupedLatestReports, project.id),
      }
      return acc
    },
    {},
  )

  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    layers2s: charts.get(ProjectId.LAYER2S)!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bridges: charts.get(ProjectId.BRIDGES)!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    combined: charts.get(ProjectId.ALL)!,
    projects: projectsResult,
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

function getExtendedProjects(
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

  return [
    { id: ProjectId.LAYER2S, sinceTimestamp: minLayer2Timestamp },
    { id: ProjectId.BRIDGES, sinceTimestamp: minBridgeTimestamp },
    { id: ProjectId.ALL, sinceTimestamp: minTimestamp },
  ]
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
