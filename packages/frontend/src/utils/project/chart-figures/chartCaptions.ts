import {
  assertUnreachable,
  formatActivityCount,
  formatBytes,
  formatCurrency,
  formatSeconds,
  type TrackedTxsConfigSubtype,
} from '@l2beat/shared-pure'
import type { L2ProjectDaThroughputChart } from '~/server/features/data-availability/throughput/getL2ProjectDaThroughtputChart'
import type { ActivityChartData } from '~/server/features/layer2s/activity/getActivityChart'
import type { EthereumActivityChartData } from '~/server/features/layer2s/activity/getEthereumActivityChart'
import { countPerSecond } from '~/server/features/layer2s/activity/utils/countPerSecond'
import type { ProjectCostsChartResponse } from '~/server/features/layer2s/costs/getProjectCostsChart'
import type { ProjectLivenessChartData } from '~/server/features/layer2s/liveness/getProjectLivenessChart'
import type { DetailedTvsChartData } from '~/server/features/layer2s/tvs/getDetailedTvsChart'
import {
  type ChartSeriesPoint,
  describeChartSeries,
} from './describeChartSeries'

/*
 * One builder per project chart. Each takes the response of the endpoint the
 * chart itself queries, so the caption describes the series the chart draws
 * for its default settings (USD, UOPS, default liveness subtype).
 */

export function getTvsChartCaption(
  projectName: string,
  chart: DetailedTvsChartData['chart'],
): string {
  return describeChartSeries({
    subject: `Total value secured by ${projectName} in USD`,
    points: chart.map(([timestamp, _, native, canonical, external]) => ({
      timestamp,
      value: sumIfAnyValue([native, canonical, external]),
    })),
    formatValue: formatUsd,
  })
}

export function getActivityChartCaption(
  projectName: string,
  data: ActivityChartData['data'],
): string {
  return describeActivity(
    projectName,
    data.map(([timestamp, txCount, , uopsCount]) =>
      toUopsPoint(timestamp, txCount, uopsCount),
    ),
  )
}

export function getEthereumActivityChartCaption(
  projectName: string,
  data: EthereumActivityChartData['data'],
): string {
  return describeActivity(
    projectName,
    data.map(([timestamp, txCount, uopsCount]) =>
      toUopsPoint(timestamp, txCount, uopsCount),
    ),
  )
}

export function getCostsChartCaption(
  projectName: string,
  response: ProjectCostsChartResponse,
): string {
  const stats = response.stats
  return describeChartSeries({
    subject: `Daily onchain costs paid by ${projectName} to Ethereum in USD`,
    points: response.chart.map(
      ([timestamp, , , overhead, , , calldata, , , compute, , , blobs]) => ({
        timestamp,
        value: sumIfAnyValue([overhead, calldata, compute, blobs]),
      }),
    ),
    formatValue: formatUsd,
    extraFacts: [
      ...describeStat('Total over this range', stats?.total.usd, formatUsd),
      ...describeStat('Average per day', stats?.perDay.usd, formatUsd),
    ],
  })
}

export function getLivenessChartCaption(
  projectName: string,
  subtype: TrackedTxsConfigSubtype,
  response: ProjectLivenessChartData,
): string {
  return describeChartSeries({
    subject: `Average interval between ${getSubtypeName(subtype)} of ${projectName}`,
    points: response.data.map(([timestamp, , avg]) => ({
      timestamp,
      value: avg,
    })),
    formatValue: formatDuration,
    extraFacts: describeStat(
      'Average over this range',
      response.stats?.[subtype],
      formatDuration,
    ),
  })
}

export function getDataPostedChartCaption(
  projectName: string,
  response: L2ProjectDaThroughputChart | null,
): string {
  const stats = response?.stats
  return describeChartSeries({
    subject: `Daily data posted by ${projectName} to its DA layers`,
    points: (response?.chart ?? []).map(([timestamp, ...perDaLayer]) => ({
      timestamp,
      value: sumIfAnyValue(perDaLayer),
    })),
    formatValue: formatBytes,
    extraFacts: [
      ...describeStat('Total over this range', stats?.total, formatBytes),
      ...describeStat('Average per day', stats?.avgPerDay, formatBytes),
    ],
  })
}

function describeActivity(projectName: string, points: ChartSeriesPoint[]) {
  return describeChartSeries({
    subject: `Daily average user operations per second (UOPS) on ${projectName}`,
    points,
    formatValue: (value) => `${formatActivityCount(value)} UOPS`,
  })
}

// Mirrors the stats panel: projects without UOPS tracking report txs.
function toUopsPoint(
  timestamp: number,
  txCount: number | null,
  uopsCount: number | null,
): ChartSeriesPoint {
  const count = uopsCount ?? txCount
  return { timestamp, value: count === null ? null : countPerSecond(count) }
}

// The same aggregates the chart's stats panel shows.
function describeStat(
  label: string,
  value: number | undefined,
  formatValue: (value: number) => string,
): string[] {
  return value !== undefined ? [`${label}: ${formatValue(value)}.`] : []
}

// Stacked charts leave a component null when it has no data; the stack
// still has a height as long as one component does.
function sumIfAnyValue(values: (number | null)[]): number | null {
  const present = values.filter((value) => value !== null)
  if (present.length === 0) return null
  return present.reduce((sum, value) => sum + value, 0)
}

function formatUsd(value: number) {
  return formatCurrency(value, 'usd')
}

function formatDuration(seconds: number) {
  return formatSeconds(seconds, { fullUnit: true })
}

function getSubtypeName(subtype: TrackedTxsConfigSubtype) {
  switch (subtype) {
    case 'stateUpdates':
      return 'state updates'
    case 'batchSubmissions':
      return 'tx data submissions'
    case 'proofSubmissions':
      return 'proof submissions'
    default:
      assertUnreachable(subtype)
  }
}
