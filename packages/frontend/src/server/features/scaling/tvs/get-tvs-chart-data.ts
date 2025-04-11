import type { ProjectValueRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { type Dictionary, uniq } from 'lodash'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getEthPrices } from './utils/get-eth-prices'
import { getTvsProjects } from './utils/get-tvs-projects'
import { getTvsTargetTimestamp } from './utils/get-tvs-target-timestamp'
import { getTvsValuesForProjects } from './utils/get-tvs-values-for-projects'
import { groupValuesByTimestamp } from './utils/groupValuesByTimestamp'
import {
  TvsProjectFilter,
  createTvsProjectsFilter,
} from './utils/project-filter-utils'
import { TvsChartRange, getRangeConfig } from './utils/range'

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
    const tvsProjects = await getTvsProjects(
      projectsFilter,
      previewRecategorisation,
    )
    // NOTE: Quick fix for now, we should reinvestigate if this is the best way to handle this
    const forSummary =
      filter.type !== 'projects' || filter.projectIds.length !== 1
    const [ethPrices, values] = await Promise.all([
      getEthPrices(),
      getTvsValuesForProjects(
        tvsProjects,
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
  values: Dictionary<Dictionary<ProjectValueRecord>>,
  ethPrices: Record<number, number>,
) {
  const groupedValues = groupValuesByTimestamp(values)

  const timestamps = uniq([...Object.keys(groupedValues)]).sort()

  return timestamps.map((timestamp) => {
    const values = groupedValues[timestamp]
    const ethPrice = ethPrices[+timestamp]
    assert(ethPrice, 'No ETH price for ' + timestamp)

    const native =
      values?.reduce((acc, curr) => {
        acc += Number(curr.native)
        return acc
      }, 0) ?? 0

    const canonical =
      values?.reduce((acc, curr) => {
        acc += Number(curr.canonical)
        return acc
      }, 0) ?? 0

    const external =
      values?.reduce((acc, curr) => {
        acc += Number(curr.external)
        return acc
      }, 0) ?? 0

    return [+timestamp, native, canonical, external, ethPrice] as const
  })
}

function getMockTvsChartData({ range }: TvsChartDataParams): TvsChartData {
  const { days, resolution } = getRangeConfig(range)
  const target = UnixTime.toStartOf(
    getTvsTargetTimestamp(),
    resolution === 'hourly' ? 'hour' : 'day',
  )
  const from = days !== null ? target - days * UnixTime.DAY : MIN_TIMESTAMPS.tvs
  const timestamps = generateTimestamps([from, target], resolution)

  return timestamps.map((timestamp) => {
    return [timestamp, 3000, 2000, 1000, 1200]
  })
}
