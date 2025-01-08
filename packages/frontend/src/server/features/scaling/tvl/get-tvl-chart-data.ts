import { type ValueRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { type Dictionary } from 'lodash'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getEthPrices } from './utils/get-eth-prices'
import { getTvlProjects } from './utils/get-tvl-projects'
import { getTvlTargetTimestamp } from './utils/get-tvl-target-timestamp'
import { getTvlValuesForProjects } from './utils/get-tvl-values-for-projects'
import {
  TvlProjectFilter,
  createTvlProjectsFilter,
} from './utils/project-filter-utils'
import { TvlChartRange, getRangeConfig } from './utils/range'
import { sumValuesPerSource } from './utils/sum-values-per-source'

export const TvlChartDataParams = z.object({
  range: TvlChartRange,
  filter: TvlProjectFilter,
  excludeAssociatedTokens: z.boolean(),
})

export type TvlChartDataParams = z.infer<typeof TvlChartDataParams>

/**
 * A function that computes values for chart data of the TVL over time.
 * @returns {
 *  total: {
 *    usd: number
 *    eth: number
 *  }
 *  chart: [timestamp, native, canonical, external, ethPrice][] - all numbers
 * }
 */
export async function getTvlChart(
  ...args: Parameters<typeof getCachedTvlChartData>
) {
  if (env.MOCK) {
    return getMockTvlChartData(...args)
  }
  return getCachedTvlChartData(...args)
}

export type TvlChartData = Awaited<ReturnType<typeof getCachedTvlChartData>>
export const getCachedTvlChartData = cache(
  async ({ range, excludeAssociatedTokens, filter }: TvlChartDataParams) => {
    const projectsFilter = createTvlProjectsFilter(filter)
    const tvlProjects = getTvlProjects(projectsFilter)

    const [ethPrices, values] = await Promise.all([
      getEthPrices(),
      getTvlValuesForProjects(tvlProjects, range),
    ])

    // NOTE: Quick fix for now, we should reinvestigate if this is the best way to handle this
    const forTotal =
      filter.type !== 'projects' || filter.projectIds.length !== 1

    return getChartData(values, ethPrices, {
      excludeAssociatedTokens,
      forTotal,
    })
  },
  ['tvl-chart-dataxx'],
  {
    tags: ['tvl'],
    revalidate: UnixTime.HOUR,
  },
)

function getChartData(
  values: Dictionary<Dictionary<ValueRecord[]>>,
  ethPrices: Record<number, number>,
  options: {
    excludeAssociatedTokens: boolean
    forTotal: boolean
  },
) {
  const timestampValues: Record<string, ValueRecord[]> = {}

  for (const projectValues of Object.values(values)) {
    for (const [timestamp, values] of Object.entries(projectValues)) {
      const map = timestampValues[timestamp] ?? []
      timestampValues[timestamp] = map.concat(values)
    }
  }

  return Object.entries(timestampValues).map(([timestamp, values]) => {
    const summed = sumValuesPerSource(values, options)
    const ethPrice = ethPrices[+timestamp]
    assert(ethPrice, 'No ETH price for ' + timestamp)

    const native = Number(summed.native)
    const canonical = Number(summed.canonical)
    const external = Number(summed.external)

    return [+timestamp, native, canonical, external, ethPrice * 100] as const
  })
}

function getMockTvlChartData({ range }: TvlChartDataParams): TvlChartData {
  const { days, resolution } = getRangeConfig(range)
  const target = getTvlTargetTimestamp().toStartOf(
    resolution === 'hourly' ? 'hour' : 'day',
  )
  const from = days !== null ? target.add(-days, 'days') : MIN_TIMESTAMPS.tvl
  const timestamps = generateTimestamps([from, target], resolution)

  return timestamps.map((timestamp) => {
    return [timestamp.toNumber(), 3000, 2000, 1000, 1200]
  })
}
