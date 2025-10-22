import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getTimestampedValuesRange } from '~/utils/range/range'
import { getEthPrices } from './utils/getEthPrices'
import {
  getSummedTvsValues,
  type SummedTvsValues,
} from './utils/getSummedTvsValues'
import { getTvsProjects } from './utils/getTvsProjects'
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
  includeRwaRestrictedTokens: v.boolean(),
})

export type TvsChartDataParams = v.infer<typeof TvsChartDataParams>

export type TvsChartDataPoint = [
  timestamp: number,
  native: number | null,
  canonical: number | null,
  external: number | null,
  ethPrice: number | null,
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
  includeRwaRestrictedTokens,
  filter,
}: TvsChartDataParams): Promise<TvsChartData> {
  if (env.MOCK) {
    return getMockTvsChartData({
      range,
      excludeAssociatedTokens,
      includeRwaRestrictedTokens,
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
    return { chart: [], syncedUntil: UnixTime.now() }
  }
  const [ethPrices, values] = await Promise.all([
    getEthPrices(),
    getSummedTvsValues(
      tvsProjects.map((p) => p.projectId),
      range,
      {
        forSummary,
        excludeAssociatedTokens,
        includeRwaRestrictedTokens,
      },
    ),
  ])

  return getChartData(values, ethPrices)
}

function getChartData(
  values: SummedTvsValues[],
  ethPrices: Record<number, number>,
): TvsChartData {
  let syncedUntil = 0
  const chart: TvsChartDataPoint[] = []

  for (const value of values) {
    if (
      value.native === null &&
      value.canonical === null &&
      value.external === null
    ) {
      chart.push([value.timestamp, null, null, null, null] as const)
      continue
    }

    const ethPrice = ethPrices[value.timestamp]
    assert(ethPrice, 'No ETH price for ' + value.timestamp)

    chart.push([
      value.timestamp,
      value.native,
      value.canonical,
      value.external,
      ethPrice,
    ] as const)

    syncedUntil = value.timestamp
  }

  return {
    chart,
    syncedUntil,
  }
}

function getMockTvsChartData({ range }: TvsChartDataParams): TvsChartData {
  const resolution = rangeToResolution(range)
  const [from, to] = getTimestampedValuesRange(range, resolution)
  const timestamps = generateTimestamps([from ?? 1573776000, to], resolution)

  return {
    chart: timestamps.map((timestamp) => {
      return [timestamp, 3000, 2000, 1000, 1200]
    }),
    syncedUntil: timestamps[timestamps.length - 1] ?? 0,
  }
}
