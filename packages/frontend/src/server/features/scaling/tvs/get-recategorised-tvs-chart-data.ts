import type { ValueRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { Dictionary } from 'lodash'
import { uniq } from 'lodash'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { ps } from '~/server/projects'
import { getTvsProjects } from './utils/get-tvs-projects'
import { getTvsTargetTimestamp } from './utils/get-tvs-target-timestamp'
import { getTvsValuesForProjects } from './utils/get-tvs-values-for-projects'
import {
  TvsProjectFilter,
  createTvsProjectsFilter,
} from './utils/project-filter-utils'
import { TvsChartRange, getRangeConfig } from './utils/range'
import { sumValuesPerSource } from './utils/sum-values-per-source'

export const RecategorisedTvsChartDataParams = z.object({
  range: TvsChartRange,
  filter: TvsProjectFilter,
  excludeAssociatedTokens: z.boolean(),
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
    excludeAssociatedTokens,
    filter,
    previewRecategorisation,
  }: RecategorisedTvsChartDataParams) => {
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

    const rollups = tvsProjects.filter(({ category }) => category === 'rollups')
    const validiumsAndOptimiums = tvsProjects.filter(
      ({ category }) => category === 'validiumsAndOptimiums',
    )
    const others = tvsProjects.filter(({ category }) => category === 'others')

    const [rollupValues, validiumAndOptimiumsValues, othersValues] =
      await Promise.all([
        getTvsValuesForProjects(rollups, range),
        getTvsValuesForProjects(validiumsAndOptimiums, range),
        getTvsValuesForProjects(others, range),
      ])

    // NOTE: Quick fix for now, we should reinvestigate if this is the best way to handle this
    const forTotal =
      filter.type !== 'projects' || filter.projectIds.length !== 1

    return getChartData(
      rollupValues,
      validiumAndOptimiumsValues,
      othersValues,
      {
        excludeAssociatedTokens,
        forTotal,
      },
    )
  },
  ['recategorised-tvs-chart-data'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getChartData(
  rollupsValues: Dictionary<Dictionary<ValueRecord[]>>,
  validiumAndOptimiumsValues: Dictionary<Dictionary<ValueRecord[]>>,
  othersValues: Dictionary<Dictionary<ValueRecord[]>>,
  options: {
    excludeAssociatedTokens: boolean
    forTotal: boolean
  },
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

    const rSummed = rVals ? sumValuesPerSource(rVals, options) : undefined
    const vSummed = vVals ? sumValuesPerSource(vVals, options) : undefined
    const oSummed = oVals ? sumValuesPerSource(oVals, options) : undefined

    const rTotal = rSummed
      ? Number(rSummed.native + rSummed.canonical + rSummed.external)
      : 0
    const vTotal = vSummed
      ? Number(vSummed.native + vSummed.canonical + vSummed.external)
      : 0
    const oTotal = oSummed
      ? Number(oSummed.native + oSummed.canonical + oSummed.external)
      : 0

    return [+timestamp, rTotal, vTotal, oTotal] as const
  })
}

function getMockTvsChartData({
  range,
}: RecategorisedTvsChartDataParams): RecategorisedTvsChartData {
  const { days, resolution } = getRangeConfig(range)
  const target = getTvsTargetTimestamp().toStartOf(
    resolution === 'hourly' ? 'hour' : 'day',
  )
  const from = days !== null ? target.add(-days, 'days') : MIN_TIMESTAMPS.tvs
  const timestamps = generateTimestamps([from, target], resolution)

  return timestamps.map((timestamp) => {
    return [timestamp.toNumber(), 3000, 2000, 1000]
  })
}

function valuesToTimestampValues(
  values: Dictionary<Dictionary<ValueRecord[]>>,
) {
  const timestampValues: Record<string, ValueRecord[]> = {}
  for (const projectValues of Object.values(values)) {
    for (const [timestamp, values] of Object.entries(projectValues)) {
      const map = timestampValues[timestamp] ?? []
      timestampValues[timestamp] = map.concat(values)
    }
  }
  return timestampValues
}
