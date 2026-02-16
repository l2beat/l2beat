import type { SummedByTimestampTvsValuesPerProjectRecord } from '@l2beat/dal'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { queryExecutor } from '~/server/queryExecutor'
import { ChartRange } from '~/utils/range/range'
import { getEthPrices } from './utils/getEthPrices'
import { isTvsSynced } from './utils/isTvsSynced'
import { rangeToResolution } from './utils/range'

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

export type ProjectTvsChartData = {
  value: number
  canonical: number
  external: number
  native: number
  ether: number
  stablecoin: number
  btc: number
  rwaRestricted: number
  rwaPublic: number
  other: number
}

type DetailedTvsChartWithProjectRangesDataPoint = {
  timestamp: number
  ethPrice: number | null
  projects: Record<string, ProjectTvsChartData | null>
}

export type DetailedTvsChartWithProjectsRangesData = {
  chart: DetailedTvsChartWithProjectRangesDataPoint[]
  projectIds: ProjectId[]
  syncedUntil: number
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

  if (projects.length === 0) {
    return { chart: [], projectIds: [], syncedUntil: UnixTime.now() }
  }

  const groupedProjects = groupBy(projects, (p) => p.projectId)
  const projectIds = Object.keys(groupedProjects) as ProjectId[]

  const [ethPrices, values] = await Promise.all([
    getEthPrices(),
    queryExecutor.execute({
      name: 'getSummedByTimestampTvsValuesPerProjectQuery',
      args: [
        projects,
        range,
        false,
        excludeAssociatedTokens,
        excludeRwaRestrictedTokens,
      ],
    }),
  ])

  return getChartData(values, ethPrices, projectIds, range)
}

function getChartData(
  values: SummedByTimestampTvsValuesPerProjectRecord[],
  ethPrices: Record<number, number>,
  projectIds: ProjectId[],
  range: ChartRange,
): DetailedTvsChartWithProjectsRangesData {
  if (values.length === 0) {
    return {
      chart: [],
      projectIds,
      syncedUntil: 0,
    }
  }

  const valuesByProjectId = new Map<
    ProjectId,
    Map<number, PerProjectTvsValuesRecord>
  >()
  let minTimestamp = Number.POSITIVE_INFINITY
  let maxTimestamp = Number.NEGATIVE_INFINITY

  for (const value of values) {
    const mappedValue = mapArrayToObject(value)
    minTimestamp = Math.min(minTimestamp, mappedValue.timestamp)
    maxTimestamp = Math.max(maxTimestamp, mappedValue.timestamp)

    const projectValues = valuesByProjectId.get(mappedValue.projectId)
    if (projectValues) {
      projectValues.set(mappedValue.timestamp, mappedValue)
      continue
    }

    valuesByProjectId.set(
      mappedValue.projectId,
      new Map([[mappedValue.timestamp, mappedValue]]),
    )
  }

  if (
    minTimestamp === Number.POSITIVE_INFINITY ||
    maxTimestamp === Number.NEGATIVE_INFINITY
  ) {
    return {
      chart: [],
      projectIds,
      syncedUntil: 0,
    }
  }

  const syncedUntil = maxTimestamp
  const adjustedTo = isTvsSynced(maxTimestamp) ? maxTimestamp : range[1]
  const resolution = rangeToResolution(range)
  const timestamps = generateTimestamps(
    [minTimestamp, adjustedTo],
    resolution,
    {
      addTarget: true,
    },
  )

  const chart: DetailedTvsChartWithProjectRangesDataPoint[] = timestamps.map(
    (timestamp) => {
      const isSynced = timestamp <= syncedUntil
      const projectsForTimestamp: Record<string, ProjectTvsChartData | null> =
        {}

      for (const projectId of projectIds) {
        const value = valuesByProjectId.get(projectId)?.get(timestamp)

        if (value) {
          projectsForTimestamp[projectId] = value
          continue
        }

        projectsForTimestamp[projectId] = isSynced
          ? { ...EMPTY_PROJECT_TVS }
          : null
      }

      if (!isSynced) {
        return {
          timestamp,
          ethPrice: null,
          projects: projectsForTimestamp,
        }
      }

      const ethPrice = ethPrices[timestamp]
      assert(ethPrice, 'No ETH price for ' + timestamp)

      return {
        timestamp,
        ethPrice,
        projects: projectsForTimestamp,
      }
    },
  )

  return {
    chart,
    projectIds,
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
  const groupedProjects = groupBy(projects, (p) => p.projectId)
  const projectIds = Object.keys(groupedProjects) as ProjectId[]

  return {
    chart: timestamps.map((timestamp) => ({
      timestamp,
      ethPrice: 3000,
      projects: Object.fromEntries(
        projectIds.map((projectId, index) => {
          const base = 1000 * (index + 1)
          return [
            projectId,
            {
              value: base * 2,
              canonical: base / 3,
              external: base / 3,
              native: base / 3,
              ether: base / 2,
              stablecoin: base / 2,
              btc: base / 3,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: base / 3,
            } satisfies ProjectTvsChartData,
          ]
        }),
      ),
    })),
    projectIds,
    syncedUntil: timestamps[timestamps.length - 1] ?? 0,
  }
}

const EMPTY_PROJECT_TVS: ProjectTvsChartData = {
  value: 0,
  canonical: 0,
  external: 0,
  native: 0,
  ether: 0,
  stablecoin: 0,
  btc: 0,
  rwaRestricted: 0,
  rwaPublic: 0,
  other: 0,
}

type PerProjectTvsValuesRecord = {
  projectId: ProjectId
  timestamp: number
  value: number
  canonical: number
  external: number
  native: number
  ether: number
  stablecoin: number
  btc: number
  rwaRestricted: number
  rwaPublic: number
  other: number
}

function mapArrayToObject([
  projectId,
  timestamp,
  value,
  canonical,
  external,
  native,
  ether,
  stablecoin,
  btc,
  rwaRestricted,
  rwaPublic,
  other,
]: SummedByTimestampTvsValuesPerProjectRecord): PerProjectTvsValuesRecord {
  return {
    projectId,
    timestamp,
    value,
    canonical,
    external,
    native,
    ether,
    stablecoin,
    btc,
    rwaRestricted,
    rwaPublic,
    other,
  }
}
