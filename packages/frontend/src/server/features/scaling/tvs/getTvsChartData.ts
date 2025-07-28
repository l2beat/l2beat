import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { MIN_TIMESTAMPS } from '~/consts/minTimestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getRangeWithMax } from '~/utils/range/range'
import { getEthPrices } from './utils/getEthPrices'
import {
  getSummedTvsValues,
  type SummedTvsValues,
} from './utils/getSummedTvsValues'
import { getTvsProjects } from './utils/getTvsProjects'
import { getTvsTargetTimestamp } from './utils/getTvsTargetTimestamp'
import {
  createTvsProjectsFilter,
  TvsProjectFilter,
} from './utils/projectFilterUtils'
import { rangeToResolution, TvsChartRange } from './utils/range'

export const TvsChartDataParams = v.object({
  range: v.union([
    v.object({
      type: TvsChartRange,
    }),
    v.object({
      type: v.literal('custom'),
      from: v.number(),
      to: v.number(),
    }),
  ]),
  filter: TvsProjectFilter,
  excludeAssociatedTokens: v.boolean(),
})

export type TvsChartDataParams = v.infer<typeof TvsChartDataParams>

type TvsChartDataPoint = [
  timestamp: number,
  native: number | null,
  canonical: number | null,
  external: number | null,
  ethPrice: number,
]
export type TvsChartData = {
  chart: TvsChartDataPoint[]
  syncedUntil: number
}

/**
 * @returns {
 *  total: {
 *    usd: number
 *    eth: number
 *  }
 *  chart: [timestamp, native, canonical, external, ethPrice][] - all numbers
 * }
 */
export async function getTvsChart({
  range,
  excludeAssociatedTokens,
  filter,
}: TvsChartDataParams): Promise<TvsChartData> {
  if (env.MOCK) {
    return getMockTvsChartData({
      range,
      excludeAssociatedTokens,
      filter,
    })
  }

  // NOTE: Quick fix for now, we should reinvestigate if this is the best way to handle this
  const forSummary =
    filter.type !== 'projects' || filter.projectIds.length !== 1

  const projectsFilter = createTvsProjectsFilter(filter)
  const tvsProjects = await getTvsProjects(projectsFilter, {
    withoutArchivedAndUpcoming: forSummary,
  })
  if (tvsProjects.length === 0) {
    return { chart: [], syncedUntil: 0 }
  }
  const [ethPrices, values] = await Promise.all([
    getEthPrices(),
    getSummedTvsValues(
      tvsProjects.map((p) => p.projectId),
      range,
      !forSummary
        ? 'PROJECT'
        : excludeAssociatedTokens
          ? 'SUMMARY_WA'
          : 'SUMMARY',
    ),
  ])

  const chart = getChartData(values, ethPrices)
  const syncedUntil = chart.findLast(
    (v) => v[1] !== null || v[2] !== null || v[3] !== null,
  )?.[0]
  assert(syncedUntil, 'No synced until timestamp found')

  return { chart, syncedUntil }
}

function getChartData(
  values: SummedTvsValues[],
  ethPrices: Record<number, number>,
): TvsChartDataPoint[] {
  return values.map((value) => {
    const ethPrice = ethPrices[value.timestamp]
    assert(ethPrice, 'No ETH price for ' + value.timestamp)

    return [
      value.timestamp,
      value.native,
      value.canonical,
      value.external,
      ethPrice,
    ] as const
  })
}

function getMockTvsChartData({ range }: TvsChartDataParams): TvsChartData {
  const resolution = rangeToResolution(range)
  const target = getTvsTargetTimestamp()
  const adjustedTarget = range.type === 'custom' ? range.to : target
  const [from, to] = getRangeWithMax(range, resolution, {
    now: adjustedTarget,
  })
  const timestamps = generateTimestamps(
    [from ?? MIN_TIMESTAMPS.tvs, to],
    resolution,
  )

  return {
    chart: timestamps.map((timestamp) => {
      return [timestamp, 3000, 2000, 1000, 1200]
    }),
    syncedUntil: timestamps[timestamps.length - 1] ?? 0,
  }
}
