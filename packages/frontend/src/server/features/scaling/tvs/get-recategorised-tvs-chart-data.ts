import type { ProjectValueRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { Dictionary } from 'lodash'
import { groupBy, pick, uniq } from 'lodash'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getTvsProjects } from './utils/get-tvs-projects'
import { getTvsTargetTimestamp } from './utils/get-tvs-target-timestamp'
import { getTvsValuesForProjects } from './utils/get-tvs-values-for-projects'
import { groupValuesByTimestamp } from './utils/groupValuesByTimestamp'
import {
  TvsProjectFilter,
  createTvsProjectsFilter,
} from './utils/project-filter-utils'
import { TvsChartRange, getRangeConfig } from './utils/range'

export const RecategorisedTvsChartDataParams = z.object({
  range: TvsChartRange,
  filter: TvsProjectFilter,
  previewRecategorisation: z.boolean().default(false),
})

export type RecategorisedTvsChartDataParams = z.infer<
  typeof RecategorisedTvsChartDataParams
>

/**
 * A function that computes values for chart data of the TVS over time.
 * @returns {
 *  [timestamp, rollups, validiumsAndOptimiums, others][] - all numbers
 * }
 */
export async function getRecategorisedTvsChart(
  ...args: Parameters<typeof getCachedRecategorisedTvsChartData>
) {
  if (env.MOCK) {
    return getMockTvsChartData(...args)
  }
  return getCachedRecategorisedTvsChartData(...args)
}

export type RecategorisedTvsChartData = Awaited<
  ReturnType<typeof getCachedRecategorisedTvsChartData>
>
export const getCachedRecategorisedTvsChartData = cache(
  async ({
    range,
    filter,
    previewRecategorisation,
  }: RecategorisedTvsChartDataParams) => {
    const projectsFilter = createTvsProjectsFilter(
      filter,
      previewRecategorisation,
    )

    const tvsProjects = await getTvsProjects(
      projectsFilter,
      previewRecategorisation,
    )

    const tvsValues = await getTvsValuesForProjects(tvsProjects, range)

    const groupedByType = groupBy(tvsProjects, 'category')
    const rollups =
      groupedByType.rollups?.map(({ projectId }) => projectId) ?? []
    const validiumsAndOptimiums =
      groupedByType.validiumsAndOptimiums?.map(({ projectId }) => projectId) ??
      []
    const others = groupedByType.others?.map(({ projectId }) => projectId) ?? []

    const rollupValues = pick(tvsValues, rollups)
    const validiumAndOptimiumsValues = pick(tvsValues, validiumsAndOptimiums)
    const othersValues = pick(tvsValues, others)

    return getChartData(rollupValues, validiumAndOptimiumsValues, othersValues)
  },
  ['recategorised-tvs-chart-data'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getChartData(
  rollupsValues: Dictionary<Dictionary<ProjectValueRecord>>,
  validiumAndOptimiumsValues: Dictionary<Dictionary<ProjectValueRecord>>,
  othersValues: Dictionary<Dictionary<ProjectValueRecord>>,
) {
  const rollupTimestampValues = groupValuesByTimestamp(rollupsValues)
  const validiumAndOptimiumsTimestampValues = groupValuesByTimestamp(
    validiumAndOptimiumsValues,
  )
  const othersTimestampValues = groupValuesByTimestamp(othersValues)

  const timestamps = uniq([
    ...Object.keys(rollupTimestampValues),
    ...Object.keys(validiumAndOptimiumsTimestampValues),
    ...Object.keys(othersTimestampValues),
  ]).sort()

  return timestamps.map((timestamp) => {
    const rVals = rollupTimestampValues[timestamp]
    const vVals = validiumAndOptimiumsTimestampValues[timestamp]
    const oVals = othersTimestampValues[timestamp]

    const rTotal =
      rVals?.reduce((acc, curr) => {
        acc += Number(curr.value)
        return acc
      }, 0) ?? 0
    const vTotal =
      vVals?.reduce((acc, curr) => {
        acc += Number(curr.value)
        return acc
      }, 0) ?? 0
    const oTotal =
      oVals?.reduce((acc, curr) => {
        acc += Number(curr.value)
        return acc
      }, 0) ?? 0

    return [+timestamp, rTotal, vTotal, oTotal] as const
  })
}

function getMockTvsChartData({
  range,
}: RecategorisedTvsChartDataParams): RecategorisedTvsChartData {
  const { days, resolution } = getRangeConfig(range)
  const target = UnixTime.toStartOf(
    getTvsTargetTimestamp(),
    resolution === 'hourly' ? 'hour' : 'day',
  )
  const from = days !== null ? target - days * UnixTime.DAY : MIN_TIMESTAMPS.tvs
  const timestamps = generateTimestamps([from, target], resolution)

  return timestamps.map((timestamp) => {
    return [timestamp, 3000, 2000, 1000]
  })
}
