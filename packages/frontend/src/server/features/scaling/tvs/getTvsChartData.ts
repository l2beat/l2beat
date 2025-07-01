import type { ProjectValueRecord } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { MIN_TIMESTAMPS } from '~/consts/minTimestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getRangeWithMax } from '~/utils/range/range'
import { getEthPrices } from './utils/getEthPrices'
import { getSummedTvsValues } from './utils/getSummedTvsValues'
import { getTvsProjects } from './utils/getTvsProjects'
import { getTvsTargetTimestamp } from './utils/getTvsTargetTimestamp'
import {
  TvsProjectFilter,
  createTvsProjectsFilter,
} from './utils/projectFilterUtils'
import { TvsChartRange, rangeToResolution } from './utils/range'

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

type TvsChartDataPoint = readonly [
  timestamp: number,
  native: number,
  canonical: number,
  external: number,
  ethPrice: number,
]
export type TvsChartData = TvsChartDataPoint[]

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
    return []
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
  return getChartData(values, ethPrices)
}

function getChartData(
  values: Omit<ProjectValueRecord, 'type' | 'project'>[],
  ethPrices: Record<number, number>,
) {
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
  const [from, to] = getRangeWithMax(range, resolution, {
    now: target,
  })
  const timestamps = generateTimestamps(
    [from ?? MIN_TIMESTAMPS.tvs, to],
    resolution,
  )

  return timestamps.map((timestamp) => {
    return [timestamp, 3000, 2000, 1000, 1200]
  })
}
