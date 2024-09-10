import { type ValueRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getEthPrices } from './get-eth-prices'
import { getTvlProjects } from './get-tvl-projects'
import { getTvlTargetTimestamp } from './get-tvl-target-timestamp'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'
import {
  TvlProjectFilter,
  createTvlProjectsFilter,
} from './project-filter-utils'
import { TvlChartRange, getRangeConfig } from './range'
import { sumValuesPerSource } from './sum-values-per-source'

export const TvlChartDataParams = z.object({
  range: TvlChartRange,
  filter: TvlProjectFilter,
  excludeAssociatedTokens: z.boolean().optional(),
})

export type TvlChartDataParams = z.infer<typeof TvlChartDataParams>

export async function getTvlChartData(
  ...args: Parameters<typeof getCachedTvlChartData>
) {
  if (env.MOCK) {
    return getMockTvlChartData(...args)
  }
  noStore()
  return getCachedTvlChartData(...args)
}

export type ScalingSummaryData = Awaited<
  ReturnType<typeof getCachedTvlChartData>
>
export const getCachedTvlChartData = cache(
  async ({ range, excludeAssociatedTokens, filter }: TvlChartDataParams) => {
    const projectsFilter = createTvlProjectsFilter(filter)

    const tvlProjects = getTvlProjects().filter(projectsFilter)

    const ethPrices = await getEthPrices()

    const values = await getTvlValuesForProjects(tvlProjects, range)

    const timestampValues: Record<string, ValueRecord[]> = {}

    for (const projectValues of Object.values(values)) {
      for (const [timestamp, values] of Object.entries(projectValues)) {
        const map = timestampValues[timestamp] ?? []
        timestampValues[timestamp] = map.concat(values)
      }
    }
    const chart = Object.entries(timestampValues).map(([timestamp, values]) => {
      const summed = sumValuesPerSource(values, {
        forTotal: true,
        excludeAssociatedTokens: !!excludeAssociatedTokens,
      })
      const ethPrice = ethPrices[+timestamp]
      assert(ethPrice, 'No ETH price for ' + timestamp)

      return [
        +timestamp,
        Number(summed.native),
        Number(summed.canonical),
        Number(summed.external),
        ethPrice * 100,
      ] as const
    })

    return chart
  },
  ['getTvlChartData'],
  { revalidate: 10 * UnixTime.MINUTE },
)

function getMockTvlChartData({
  range,
}: TvlChartDataParams): ScalingSummaryData {
  const { days, resolution } = getRangeConfig(range)
  const target = getTvlTargetTimestamp().toStartOf(
    resolution === 'hourly' ? 'hour' : 'day',
  )
  const from =
    days !== Infinity ? target.add(-days, 'days') : target.add(-730, 'days')
  const timestamps = generateTimestamps([from, target], resolution)

  return timestamps.map((timestamp) => {
    return [timestamp.toNumber(), 3000, 2000, 1000, 1200]
  })
}
