import type { ProjectValueRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { Dictionary } from 'lodash'
import { pick, uniq } from 'lodash'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getTvsProjects } from './utils/get-tvs-projects'
import { getTvsTargetTimestamp } from './utils/get-tvs-target-timestamp'
import { getTvsValuesForProjects } from './utils/get-tvs-values-for-projects'
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

    const rollups = tvsProjects.filter(({ category }) => category === 'rollups')
    const validiumsAndOptimiums = tvsProjects.filter(
      ({ category }) => category === 'validiumsAndOptimiums',
    )
    const others = tvsProjects.filter(({ category }) => category === 'others')

    const tvsValues = await getTvsValuesForProjects(tvsProjects, range)

    const rollupValues = pick(
      tvsValues,
      rollups.map(({ projectId }) => projectId),
    )
    const validiumAndOptimiumsValues = pick(
      tvsValues,
      validiumsAndOptimiums.map(({ projectId }) => projectId),
    )
    const othersValues = pick(
      tvsValues,
      others.map(({ projectId }) => projectId),
    )

    return getChartData(rollupValues, validiumAndOptimiumsValues, othersValues)
  },
  ['recategorised-new-tvs-cxhart-xdaxta'],
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
  const rollupTimestampValues = valuesToTimestampValues(rollupsValues)
  const validiumAndOptimiumsTimestampValues = valuesToTimestampValues(
    validiumAndOptimiumsValues,
  )
  const othersTimestampValues = valuesToTimestampValues(othersValues)

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

function valuesToTimestampValues(
  values: Dictionary<Dictionary<ProjectValueRecord>>,
) {
  const timestampValues: Record<string, ProjectValueRecord[]> = {}
  for (const projectValues of Object.values(values)) {
    for (const [timestamp, value] of Object.entries(projectValues)) {
      const map = timestampValues[timestamp] ?? []
      timestampValues[timestamp] = map.concat(value)
    }
  }
  return timestampValues
}
