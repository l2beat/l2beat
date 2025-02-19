import type { ValueRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import type { Dictionary } from 'lodash'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { ps } from '~/server/projects'
import { getEthPrices } from './utils/get-eth-prices'
import { getTvsProjects } from './utils/get-tvs-projects'
import { getTvsTargetTimestamp } from './utils/get-tvs-target-timestamp'
import { getTvsValuesForProjects } from './utils/get-tvs-values-for-projects'
import {
  TvsProjectFilter,
  createTvsProjectsFilter,
} from './utils/project-filter-utils'
import { TvsChartRange, getRangeConfig } from './utils/range'
import { sumValuesPerSource } from './utils/sum-values-per-source'

export const TvsChartDataParams = z.object({
  range: TvsChartRange,
  filter: TvsProjectFilter,
  excludeAssociatedTokens: z.boolean(),
  previewRecategorisation: z.boolean().default(false),
})

export type TvsChartDataParams = z.infer<typeof TvsChartDataParams>

/**
 * A function that computes values for chart data of the TVS over time.
 * @returns {
 *  total: {
 *    usd: number
 *    eth: number
 *  }
 *  chart: [timestamp, native, canonical, external, ethPrice][] - all numbers
 * }
 */
export async function getTvsChart(
  ...args: Parameters<typeof getCachedTvsChartData>
) {
  if (env.MOCK) {
    return getMockTvsChartData(...args)
  }
  return getCachedTvsChartData(...args)
}

export type TvsChartData = Awaited<ReturnType<typeof getCachedTvsChartData>>
export const getCachedTvsChartData = cache(
  async ({
    range,
    excludeAssociatedTokens,
    filter,
    previewRecategorisation,
  }: TvsChartDataParams) => {
    const projectsFilter = createTvsProjectsFilter(
      filter,
      previewRecategorisation,
    )
    const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
      (p) => p.chainConfig,
    )
    const tvsProjects = getTvsProjects(
      projectsFilter,
      chains,
      previewRecategorisation,
    )
    const [ethPrices, values] = await Promise.all([
      getEthPrices(),
      getTvsValuesForProjects(tvsProjects, range),
    ])

    // NOTE: Quick fix for now, we should reinvestigate if this is the best way to handle this
    const forTotal =
      filter.type !== 'projects' || filter.projectIds.length !== 1

    return getChartData(values, ethPrices, {
      excludeAssociatedTokens,
      forTotal,
    })
  },
  ['tvs-chart-data'],
  {
    tags: ['hourly-data'],
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

function getMockTvsChartData({ range }: TvsChartDataParams): TvsChartData {
  const { days, resolution } = getRangeConfig(range)
  const target = getTvsTargetTimestamp().toStartOf(
    resolution === 'hourly' ? 'hour' : 'day',
  )
  const from = days !== null ? target.add(-days, 'days') : MIN_TIMESTAMPS.tvs
  const timestamps = generateTimestamps([from, target], resolution)

  return timestamps.map((timestamp) => {
    return [timestamp.toNumber(), 3000, 2000, 1000, 1200]
  })
}
