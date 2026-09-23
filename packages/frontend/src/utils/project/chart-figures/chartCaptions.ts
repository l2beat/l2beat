import {
  assertUnreachable,
  formatActivityCount,
  formatBytes,
  formatCurrency,
  formatSeconds,
  type TrackedTxsConfigSubtype,
} from '@l2beat/shared-pure'
import type { L2ProjectDaThroughputChart } from '~/server/features/data-availability/throughput/getL2ProjectDaThroughtputChart'
import { countPerSecond } from '~/server/features/layer2s/activity/utils/countPerSecond'
import type { ProjectCostsChartResponse } from '~/server/features/layer2s/costs/getProjectCostsChart'
import type { ProjectLivenessChartData } from '~/server/features/layer2s/liveness/getProjectLivenessChart'
import type { DetailedTvsChartData } from '~/server/features/layer2s/tvs/getDetailedTvsChart'
import { describeChartSeries } from './describeChartSeries'

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
    formatValue: (value) => formatCurrency(value, 'usd'),
  })
}

/** Activity points normalised to what both the project and Ethereum charts return */
export type ActivityCaptionPoint = [
  timestamp: number,
  txCount: number | null,
  uopsCount: number | null,
]

export function getActivityChartCaption(
  projectName: string,
  data: ActivityCaptionPoint[],
): string {
  return describeChartSeries({
    subject: `Daily average user operations per second (UOPS) on ${projectName}`,
    points: data.map(([timestamp, txCount, uopsCount]) => {
      // Mirrors the stats panel: projects without UOPS tracking report txs.
      const count = uopsCount ?? txCount
      return {
        timestamp,
        value: count === null ? null : countPerSecond(count),
      }
    }),
    formatValue: (value) => `${formatActivityCount(value)} UOPS`,
  })
}

export function getCostsChartCaption(
  projectName: string,
  response: ProjectCostsChartResponse,
): string {
  const formatValue = (value: number) => formatCurrency(value, 'usd')
  const total = response.stats?.total.usd
  return describeChartSeries({
    subject: `Daily onchain costs paid by ${projectName} to Ethereum in USD`,
    points: response.chart.map(
      ([timestamp, , , overhead, , , calldata, , , compute, , , blobs]) => ({
        timestamp,
        value: sumIfAnyValue([overhead, calldata, compute, blobs]),
      }),
    ),
    formatValue,
    extraFacts:
      total !== undefined
        ? [`Total over this range: ${formatValue(total)}.`]
        : [],
  })
}

export function getLivenessChartCaption(
  projectName: string,
  subtype: TrackedTxsConfigSubtype,
  data: ProjectLivenessChartData['data'],
): string {
  return describeChartSeries({
    subject: `Average interval between ${getSubtypeName(subtype)} of ${projectName}`,
    points: data.map(([timestamp, , avg]) => ({ timestamp, value: avg })),
    formatValue: (value) => formatSeconds(value, { fullUnit: true }),
  })
}

export function getDataPostedChartCaption(
  projectName: string,
  response: L2ProjectDaThroughputChart | null,
): string {
  const total = response?.stats.total
  return describeChartSeries({
    subject: `Daily data posted by ${projectName} to its DA layers`,
    points: (response?.chart ?? []).map(([timestamp, ...perDaLayer]) => ({
      timestamp,
      value: sumIfAnyValue(perDaLayer),
    })),
    formatValue: (value) => formatBytes(value),
    extraFacts:
      total !== undefined
        ? [`Total over this range: ${formatBytes(total)}.`]
        : [],
  })
}

// Stacked charts leave a component null when it has no data; the stack
// still has a height as long as one component does.
function sumIfAnyValue(values: (number | null)[]): number | null {
  const present = values.filter((value) => value !== null)
  if (present.length === 0) return null
  return present.reduce((sum, value) => sum + value, 0)
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
