import type { ProjectValueRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getRangeWithMax } from '~/utils/range/range'
import { getEthPrices } from './utils/get-eth-prices'
import { getSummedTvsValues } from './utils/get-summed-tvs-values'
import { getTvsProjects } from './utils/get-tvs-projects'
import { getTvsTargetTimestamp } from './utils/get-tvs-target-timestamp'
import {
  TvsProjectFilter,
  createTvsProjectsFilter,
} from './utils/project-filter-utils'
import { TvsChartRange, rangeToResolution } from './utils/range'

export const TvsChartDataParams = z.object({
  range: TvsChartRange,
  filter: TvsProjectFilter,
  excludeAssociatedTokens: z.boolean(),
  previewRecategorisation: z.boolean(),
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
    const tvsProjects = await getTvsProjects(
      projectsFilter,
      previewRecategorisation,
    )
    if (tvsProjects.length === 0) {
      return []
    }
    // NOTE: Quick fix for now, we should reinvestigate if this is the best way to handle this
    const forSummary =
      filter.type !== 'projects' || filter.projectIds.length !== 1
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
  },
  ['tvs-chart-data'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

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
