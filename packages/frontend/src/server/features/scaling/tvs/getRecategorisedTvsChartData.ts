import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import uniq from 'lodash/uniq'
import { MIN_TIMESTAMPS } from '~/consts/minTimestamps'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getRangeWithMax } from '~/utils/range/range'
import {
  getSummedTvsValues,
  type SummedTvsValues,
} from './utils/getSummedTvsValues'
import { getTvsProjects } from './utils/getTvsProjects'
import { getTvsTargetTimestamp } from './utils/getTvsTargetTimestamp'
import {
  createTvsProjectsFilter,
  TvsProjectFilter,
} from './utils/projectFilterUtils'
import { rangeToResolution, TvsChartRange } from './utils/range'

export const RecategorisedTvsChartDataParams = v.object({
  range: TvsChartRange,
  filter: TvsProjectFilter,
})

export type RecategorisedTvsChartDataParams = v.infer<
  typeof RecategorisedTvsChartDataParams
>

export type RecategorisedTvsChartData = (readonly [
  timestamp: number,
  rollups: number | null,
  validiumsAndOptimiums: number | null,
  others: number | null,
])[]

/**
 * A function that computes values for chart data of the TVS over time.
 * @returns {
 *  [timestamp, rollups, validiumsAndOptimiums, others][] - all numbers
 * }
 */
export async function getRecategorisedTvsChart({
  range,
  filter,
}: RecategorisedTvsChartDataParams): Promise<RecategorisedTvsChartData> {
  if (env.MOCK) {
    return getMockTvsChartData({ range, filter })
  }

  const projectsFilter = createTvsProjectsFilter(filter)

  const tvsProjects = await getTvsProjects(projectsFilter, {
    withoutArchivedAndUpcoming: true,
  })

  if (tvsProjects.length === 0) {
    return []
  }

  const groupedByType = groupBy(tvsProjects, (p) => p.category)
  const rollups = groupedByType.rollups?.map(({ projectId }) => projectId) ?? []
  const validiumsAndOptimiums =
    groupedByType.validiumsAndOptimiums?.map(({ projectId }) => projectId) ?? []
  const others = groupedByType.others?.map(({ projectId }) => projectId) ?? []

  const [rollupValues, validiumAndOptimiumsValues, othersValues] =
    await Promise.all([
      getSummedTvsValues(rollups, { type: range }, 'SUMMARY'),
      getSummedTvsValues(validiumsAndOptimiums, { type: range }, 'SUMMARY'),
      getSummedTvsValues(others, { type: range }, 'SUMMARY'),
    ])

  return getChartData(rollupValues, validiumAndOptimiumsValues, othersValues)
}

function getChartData(
  rollupsValues: SummedTvsValues[],
  validiumAndOptimiumsValues: SummedTvsValues[],
  othersValues: SummedTvsValues[],
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
      rVals?.reduce<number | null>((acc, curr) => {
        if (curr.value !== null) {
          acc = (acc ?? 0) + curr.value
        }
        return acc
      }, null) ?? null
    const vTotal =
      vVals?.reduce<number | null>((acc, curr) => {
        if (curr.value !== null) {
          acc = (acc ?? 0) + curr.value
        }
        return acc
      }, null) ?? null
    const oTotal =
      oVals?.reduce<number | null>((acc, curr) => {
        if (curr.value !== null) {
          acc = (acc ?? 0) + curr.value
        }
        return acc
      }, null) ?? null

    return [timestamp, rTotal, vTotal, oTotal] as const
  })
}

function getMockTvsChartData({
  range,
}: RecategorisedTvsChartDataParams): RecategorisedTvsChartData {
  const resolution = rangeToResolution({ type: range })
  const target = getTvsTargetTimestamp()
  const [from, to] = getRangeWithMax({ type: range }, resolution, {
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
