import type { ProjectValueRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import uniq from 'lodash/uniq'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getRangeWithMax } from '~/utils/range/range'
import { getSummedTvsValues } from './utils/get-summed-tvs-values'
import { getTvsProjects } from './utils/get-tvs-projects'
import { getTvsTargetTimestamp } from './utils/get-tvs-target-timestamp'
import {
  TvsProjectFilter,
  createTvsProjectsFilter,
} from './utils/project-filter-utils'
import { TvsChartRange, rangeToResolution } from './utils/range'

export const RecategorisedTvsChartDataParams = z.object({
  range: TvsChartRange,
  filter: TvsProjectFilter,
  previewRecategorisation: z.boolean(),
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

    if (tvsProjects.length === 0) {
      return []
    }

    const groupedByType = groupBy(tvsProjects, (p) => p.category)
    const rollups =
      groupedByType.rollups?.map(({ projectId }) => projectId) ?? []
    const validiumsAndOptimiums =
      groupedByType.validiumsAndOptimiums?.map(({ projectId }) => projectId) ??
      []
    const others = groupedByType.others?.map(({ projectId }) => projectId) ?? []

    const [rollupValues, validiumAndOptimiumsValues, othersValues] =
      await Promise.all([
        getSummedTvsValues(rollups, range, 'SUMMARY'),
        getSummedTvsValues(validiumsAndOptimiums, range, 'SUMMARY'),
        getSummedTvsValues(others, range, 'SUMMARY'),
      ])

    return getChartData(rollupValues, validiumAndOptimiumsValues, othersValues)
  },
  ['recategorised-tvs-chart-data'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getChartData(
  rollupsValues: Omit<ProjectValueRecord, 'type' | 'project'>[],
  validiumAndOptimiumsValues: Omit<ProjectValueRecord, 'type' | 'project'>[],
  othersValues: Omit<ProjectValueRecord, 'type' | 'project'>[],
) {
  const rolupsGroupedByTimestamp = groupBy(rollupsValues, (v) => v.timestamp)
  const validiumAndOptimiumsGroupedByTimestamp = groupBy(
    validiumAndOptimiumsValues,
    (v) => v.timestamp,
  )
  const othersGroupedByTimestamp = groupBy(othersValues, (v) => v.timestamp)

  const timestamps = uniq([
    ...rollupsValues.map((v) => v.timestamp),
    ...validiumAndOptimiumsValues.map((v) => v.timestamp),
    ...othersValues.map((v) => v.timestamp),
  ]).sort()

  return timestamps.map((timestamp) => {
    const rVals = rolupsGroupedByTimestamp[timestamp]
    const vVals = validiumAndOptimiumsGroupedByTimestamp[timestamp]
    const oVals = othersGroupedByTimestamp[timestamp]

    const rTotal =
      rVals?.reduce((acc, curr) => {
        acc += curr.value
        return acc
      }, 0) ?? 0
    const vTotal =
      vVals?.reduce((acc, curr) => {
        acc += curr.value
        return acc
      }, 0) ?? 0
    const oTotal =
      oVals?.reduce((acc, curr) => {
        acc += curr.value
        return acc
      }, 0) ?? 0

    return [timestamp, rTotal, vTotal, oTotal] as const
  })
}

function getMockTvsChartData({
  range,
}: RecategorisedTvsChartDataParams): RecategorisedTvsChartData {
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
    return [timestamp, 3000, 2000, 1000]
  })
}
