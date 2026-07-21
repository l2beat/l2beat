import type { SummedByTimestampTokenValuePerProjectRecord } from '@l2beat/database'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getChartStartTimestamp } from '~/server/features/utils/getChartStartTimestamp'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import { ChartRange, rangeToResolution } from '~/utils/range/range'
import { getEthPrices } from './utils/getEthPrices'
import { isTvsSynced } from './utils/isTvsSynced'

export const TvsChartWithProjectsRangesDataParams = v.object({
  range: ChartRange,
  excludeAssociatedTokens: v.boolean(),
  excludeRwaRestrictedTokens: v.boolean(),
  projects: v.array(
    v.object({
      projectId: v.string().transform((value) => value as ProjectId),
      sinceTimestamp: v.number(),
      untilTimestamp: v.number().optional(),
    }),
  ),
})

export type TvsChartWithProjectsRangesDataParams = v.infer<
  typeof TvsChartWithProjectsRangesDataParams
>

export type ProjectTvsChartDataPoint = [
  value: number,
  canonical: number,
  external: number,
  native: number,
  ether: number,
  stablecoin: number,
  btc: number,
  rwaRestricted: number,
  rwaPublic: number,
  other: number,
]

export type DetailedTvsChartWithProjectRangesDataPoint = [
  timestamp: number,
  ethPrice: number | null,
  projects: Record<string, ProjectTvsChartDataPoint | null>,
]

export type ChartProjectRange = {
  projectId: ProjectId
  /** Floored to the active resolution, matching the chart's data gate. */
  sinceTimestamp: number
}

export type DetailedTvsChartWithProjectsRangesData = {
  chart: DetailedTvsChartWithProjectRangesDataPoint[]
  projects: ChartProjectRange[]
  syncedUntil: number
  changePeriod: PercentageChangePeriod
}

/**
 * @returns detailed chart data split by project id and timestamp
 */
export async function getDetailedTvsChartWithProjectsRanges({
  range,
  excludeAssociatedTokens,
  excludeRwaRestrictedTokens,
  projects,
}: TvsChartWithProjectsRangesDataParams): Promise<DetailedTvsChartWithProjectsRangesData> {
  if (env.MOCK) {
    return getMockDetailedTvsChartWithProjectsRangesData({
      range,
      excludeAssociatedTokens,
      excludeRwaRestrictedTokens,
      projects,
    })
  }
  const db = getDb()

  if (projects.length === 0) {
    return {
      chart: [],
      projects: [],
      syncedUntil: UnixTime.now(),
      changePeriod: '7D',
    }
  }

  // Round each project's `sinceTimestamp` down to the active resolution so the
  // TVS bump it produces lands on the same datapoint as its milestone marker.
  // Without this the `>= sinceTimestamp` gate surfaces the value at the *next*
  // datapoint, one bucket after the start-of-period milestone. The rounded
  // values are returned to the client so its tooltip gate can't drift from the
  // data gate computed here.
  const resolution = rangeToResolution(range)
  const roundedProjects = projects.map((p) => ({
    ...p,
    sinceTimestamp: UnixTime.toStartOf(p.sinceTimestamp, resolution),
  }))

  const projectRanges: ChartProjectRange[] = Object.entries(
    groupBy(roundedProjects, (p) => p.projectId),
  ).map(([projectId, group]) => ({
    projectId: projectId as ProjectId,
    sinceTimestamp: Math.min(...group.map((p) => p.sinceTimestamp)),
  }))
  const projectIds = projectRanges.map((p) => p.projectId)

  const [ethPrices, values] = await Promise.all([
    getEthPrices(),
    db.tvsTokenValue.getSummedByTimestampWithProjectsRangesPerProject(
      roundedProjects,
      range[0],
      range[1],
      {
        forSummary: false,
        excludeAssociatedTokens,
        excludeRwaRestrictedTokens,
      },
    ),
  ])

  const firstProjectTimestamp = Math.min(
    ...roundedProjects.map((p) => p.sinceTimestamp),
  )

  const { chart, syncedUntil } = getChartData(
    values,
    ethPrices,
    projectIds,
    range,
    firstProjectTimestamp,
  )

  return { chart, projects: projectRanges, syncedUntil, changePeriod: '7D' }
}

function getChartData(
  values: SummedByTimestampTokenValuePerProjectRecord[],
  ethPrices: Record<number, number>,
  projectIds: ProjectId[],
  range: ChartRange,
  firstProjectTimestamp: number,
): Pick<DetailedTvsChartWithProjectsRangesData, 'chart' | 'syncedUntil'> {
  if (values.length === 0) {
    return {
      chart: [],
      syncedUntil: 0,
    }
  }

  const valuesByProjectId = new Map<
    string,
    Map<number, PerProjectTvsValuesRecord>
  >()
  let minTimestamp = Number.POSITIVE_INFINITY
  let maxTimestamp = Number.NEGATIVE_INFINITY

  for (const value of values) {
    minTimestamp = Math.min(minTimestamp, value.timestamp)
    maxTimestamp = Math.max(maxTimestamp, value.timestamp)

    const projectValues = valuesByProjectId.get(value.projectId)
    if (projectValues) {
      projectValues.set(value.timestamp, value)
      continue
    }

    valuesByProjectId.set(value.projectId, new Map([[value.timestamp, value]]))
  }

  assert(
    minTimestamp !== Number.POSITIVE_INFINITY,
    'Min timestamp is positive infinity',
  )
  assert(
    maxTimestamp !== Number.NEGATIVE_INFINITY,
    'Max timestamp is negative infinity',
  )

  const syncedUntil = maxTimestamp
  const adjustedTo = isTvsSynced(maxTimestamp) ? maxTimestamp : range[1]
  const resolution = rangeToResolution(range)
  const startTimestamp = getChartStartTimestamp({
    rangeStart: range[0],
    firstProjectTimestamp,
    dataStart: minTimestamp,
    resolution,
  })
  const timestamps = generateTimestamps(
    [startTimestamp, adjustedTo],
    resolution,
    {
      addTarget: true,
    },
  )

  const chart: DetailedTvsChartWithProjectRangesDataPoint[] = timestamps.map(
    (timestamp) => {
      const isSynced = timestamp <= syncedUntil
      const projectsForTimestamp: Record<
        string,
        ProjectTvsChartDataPoint | null
      > = {}

      for (const projectId of projectIds) {
        const value = valuesByProjectId.get(projectId)?.get(timestamp)
        if (value) {
          projectsForTimestamp[projectId] = mapValue(value)
          continue
        }

        projectsForTimestamp[projectId] = isSynced ? EMPTY_PROJECT_TVS : null
      }

      if (!isSynced) {
        return [timestamp, null, projectsForTimestamp]
      }

      const ethPrice = ethPrices[timestamp]
      assert(ethPrice, 'No ETH price for ' + timestamp)

      return [timestamp, ethPrice, projectsForTimestamp]
    },
  )

  return {
    chart,
    syncedUntil,
  }
}

function getMockDetailedTvsChartWithProjectsRangesData({
  range,
  projects,
}: TvsChartWithProjectsRangesDataParams): DetailedTvsChartWithProjectsRangesData {
  const resolution = rangeToResolution(range)
  const timestamps = generateTimestamps(
    [range[0] ?? 1573776000, range[1]],
    resolution,
  )
  const projectRanges: ChartProjectRange[] = Object.entries(
    groupBy(projects, (p) => p.projectId),
  ).map(([projectId, group]) => ({
    projectId: projectId as ProjectId,
    sinceTimestamp: UnixTime.toStartOf(
      Math.min(...group.map((p) => p.sinceTimestamp)),
      resolution,
    ),
  }))
  const projectIds = projectRanges.map((p) => p.projectId)

  return {
    chart: timestamps.map((timestamp) => [
      timestamp,
      3000,
      Object.fromEntries(
        projectIds.map((projectId, index) => {
          const base = 1000 * (index + 1)
          return [
            projectId,
            [
              base * 2,
              base / 3,
              base / 3,
              base / 3,
              base / 2,
              base / 2,
              base / 3,
              0,
              0,
              base / 3,
            ] as ProjectTvsChartDataPoint,
          ]
        }),
      ),
    ]),
    projects: projectRanges,
    syncedUntil: timestamps[timestamps.length - 1] ?? 0,
    changePeriod: '7D',
  }
}

const EMPTY_PROJECT_TVS: ProjectTvsChartDataPoint = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]

type PerProjectTvsValuesRecord = {
  projectId: string
  timestamp: number
  value: number
  canonical: number
  customCanonical: number
  external: number
  native: number
  ether: number
  stablecoin: number
  btc: number
  rwaRestricted: number
  rwaPublic: number
  other: number
}

function mapValue(value: PerProjectTvsValuesRecord): ProjectTvsChartDataPoint {
  return [
    value.value,
    value.canonical + value.customCanonical,
    value.external,
    value.native,
    value.ether,
    value.stablecoin,
    value.btc,
    value.rwaRestricted,
    value.rwaPublic,
    value.other,
  ]
}
