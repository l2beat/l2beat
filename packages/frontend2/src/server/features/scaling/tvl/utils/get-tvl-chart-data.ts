import { type ValueRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { z } from 'zod'
import { getEthPrices } from './get-eth-prices'
import { getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'
import {
  TvlProjectFilter,
  createTvlProjectsFilter,
} from './project-filter-utils'
import { TvlChartRange } from './range'
import { sumValuesPerSource } from './sum-values-per-source'

export const TvlChartDataParams = z
  .object({
    range: TvlChartRange,
    excludeAssociatedTokens: z.boolean().optional(),
  })
  .and(TvlProjectFilter)

export type TvlChartDataParams = z.infer<typeof TvlChartDataParams>

export async function getTvlChartData(
  ...args: Parameters<typeof getCachedTvlChartData>
) {
  noStore()
  return getCachedTvlChartData(...args)
}

export const getCachedTvlChartData = cache(
  async ({ range, excludeAssociatedTokens, ...filter }: TvlChartDataParams) => {
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
      return [
        +timestamp,
        Number(summed.native),
        Number(summed.canonical),
        Number(summed.external),
        ethPrices[+timestamp]! * 100,
      ] as const
    })

    return chart
  },
  ['getTvlChartData'],
  { revalidate: 10 * UnixTime.MINUTE },
)

export type ScalingSummaryData = Awaited<
  ReturnType<typeof getCachedTvlChartData>
>
