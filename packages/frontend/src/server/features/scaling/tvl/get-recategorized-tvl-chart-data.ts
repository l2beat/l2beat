import { type ValueRecord } from '@l2beat/database'
import { type Dictionary, uniq } from 'lodash'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getTvlProjects } from './utils/get-tvl-projects'
import { getTvlTargetTimestamp } from './utils/get-tvl-target-timestamp'
import { getTvlValuesForProjects } from './utils/get-tvl-values-for-projects'
import {
  TvlProjectFilter,
  createTvlProjectsFilter,
} from './utils/project-filter-utils'
import { TvlChartRange, getRangeConfig } from './utils/range'
import { sumValuesPerSource } from './utils/sum-values-per-source'

export const RecategorizedTvlChartDataParams = z.object({
  range: TvlChartRange,
  filter: TvlProjectFilter,
  excludeAssociatedTokens: z.boolean(),
  previewRecategorisation: z.boolean(),
})

export type RecategorizedTvlChartDataParams = z.infer<
  typeof RecategorizedTvlChartDataParams
>

/**
 * A function that computes values for chart data of the TVL over time.
 * @returns {
 *  [timestamp, rollups, validiumsAndOptimiums, others][] - all numbers
 * }
 */
export async function getRecategorizedTvlChart(
  ...args: Parameters<typeof getCachedRecategorizedTvlChartData>
) {
  if (env.MOCK) {
    return getMockTvlChartData(...args)
  }
  return getCachedRecategorizedTvlChartData(...args)
}

export type RecategorizedTvlChartData = Awaited<
  ReturnType<typeof getCachedRecategorizedTvlChartData>
>
export const getCachedRecategorizedTvlChartData = cache(
  async ({
    range,
    excludeAssociatedTokens,
    filter,
    previewRecategorisation,
  }: RecategorizedTvlChartDataParams) => {
    const projectsFilter = createTvlProjectsFilter(filter)
    const tvlProjects = getTvlProjects(projectsFilter, previewRecategorisation)

    const rollups = tvlProjects.filter(({ category }) => category === 'rollups')
    const validiumsAndOptimiums = tvlProjects.filter(
      ({ category }) => category === 'validiumsAndOptimiums',
    )
    const others = tvlProjects.filter(({ category }) => category === 'others')

    const [rollupValues, validiumAndOptimiumsValues, othersValues] =
      await Promise.all([
        getTvlValuesForProjects(rollups, range),
        getTvlValuesForProjects(validiumsAndOptimiums, range),
        getTvlValuesForProjects(others, range),
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
  ['recategorized-tvl-chart-data'],
  {
    tags: ['tvl'],
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

function getMockTvlChartData({
  range,
}: RecategorizedTvlChartDataParams): RecategorizedTvlChartData {
  const { days, resolution } = getRangeConfig(range)
  const target = getTvlTargetTimestamp().toStartOf(
    resolution === 'hourly' ? 'hour' : 'day',
  )
  const from = days !== null ? target.add(-days, 'days') : MIN_TIMESTAMPS.tvl
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
