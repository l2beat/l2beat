import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { DetailedTvsChartWithProjectsRangesData } from '~/server/features/scaling/tvs/getDetailedTvsChartWithProjectsRanges'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'

export interface ZkCatalogProverTvsRange {
  projectId: ProjectId
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export interface ZkCatalogProverForChart {
  proverId: string
  projectsForTvs: ZkCatalogProverTvsRange[]
}

export interface ZkCatalogProverChartDataPoint {
  timestamp: number
  [proverId: string]: number | null
}

export interface ZkCatalogProverChartData {
  chartData: ZkCatalogProverChartDataPoint[]
  visibleProverIds: string[]
  chartOrderedIds: string[]
  legendOrderedIds: string[]
  total: number | undefined
  change: number | undefined
  syncedUntil: number | undefined
}

export function getProjectsForTvsQuery(
  provers: ZkCatalogProverForChart[],
): ZkCatalogProverTvsRange[] {
  const deduplicated = new Map<string, ZkCatalogProverTvsRange>()

  for (const prover of provers) {
    for (const range of prover.projectsForTvs) {
      const key = `${range.projectId}-${range.sinceTimestamp}-${range.untilTimestamp ?? 'none'}`
      deduplicated.set(key, range)
    }
  }

  return [...deduplicated.values()]
}

export function getZkCatalogProverChartData(
  data: DetailedTvsChartWithProjectsRangesData | undefined,
  provers: ZkCatalogProverForChart[],
): ZkCatalogProverChartData {
  const proverIds = provers.map((prover) => prover.proverId)
  if (!data) {
    return {
      chartData: [],
      visibleProverIds: [],
      chartOrderedIds: [],
      legendOrderedIds: [],
      total: undefined,
      change: undefined,
      syncedUntil: undefined,
    }
  }

  const earliestSinceByProver = new Map<string, number>()
  for (const prover of provers) {
    earliestSinceByProver.set(
      prover.proverId,
      Math.min(
        ...prover.projectsForTvs.map((range) => range.sinceTimestamp),
        Number.POSITIVE_INFINITY,
      ),
    )
  }

  const chartData = data.chart.map(([timestamp, ethPrice, projects]) => {
    const dataPoint: ZkCatalogProverChartDataPoint = { timestamp }

    for (const prover of provers) {
      if (ethPrice === null) {
        dataPoint[prover.proverId] = null
        continue
      }

      const activeProjectIds = getActiveProjectIds(
        prover.projectsForTvs,
        timestamp,
      )

      if (activeProjectIds.size === 0) {
        dataPoint[prover.proverId] = null
        continue
      }

      let total = 0
      for (const projectId of activeProjectIds) {
        total += projects[projectId]?.[0] ?? 0
      }

      dataPoint[prover.proverId] = total
    }

    return dataPoint
  })

  const visibleProverIds = proverIds.filter((proverId) =>
    chartData.some((point) => {
      const value = point[proverId]
      return typeof value === 'number' && value > 0
    }),
  )

  const latestPoint = [...chartData]
    .reverse()
    .find((point) => hasAnyValue(point, visibleProverIds))
  const oldestPoint = chartData.find((point) =>
    hasAnyValue(point, visibleProverIds),
  )

  const total = latestPoint
    ? sumValues(latestPoint, visibleProverIds)
    : undefined
  const oldestTotal = oldestPoint
    ? sumValues(oldestPoint, visibleProverIds)
    : undefined
  const change =
    total !== undefined && oldestTotal !== undefined
      ? calculatePercentageChange(total, oldestTotal)
      : undefined

  const chartOrderedIds = [...visibleProverIds].sort(
    (a, b) =>
      (earliestSinceByProver.get(a) ?? Number.POSITIVE_INFINITY) -
      (earliestSinceByProver.get(b) ?? Number.POSITIVE_INFINITY),
  )

  const legendOrderedIds = [...visibleProverIds].sort(
    (a, b) => (latestPoint?.[b] ?? 0) - (latestPoint?.[a] ?? 0),
  )

  return {
    chartData,
    visibleProverIds,
    chartOrderedIds,
    legendOrderedIds,
    total,
    change,
    syncedUntil: data.syncedUntil,
  }
}

function getActiveProjectIds(
  projectsForTvs: ZkCatalogProverTvsRange[],
  timestamp: number,
) {
  const activeProjectIds = new Set<ProjectId>()

  for (const projectRange of projectsForTvs) {
    if (
      projectRange.sinceTimestamp <= timestamp &&
      (projectRange.untilTimestamp === undefined ||
        projectRange.untilTimestamp >= timestamp)
    ) {
      activeProjectIds.add(projectRange.projectId)
    }
  }

  return activeProjectIds
}

function hasAnyValue(
  point: ZkCatalogProverChartDataPoint,
  proverIds: string[],
) {
  return proverIds.some((proverId) => {
    const value = point[proverId]
    return typeof value === 'number' && value > 0
  })
}

function sumValues(point: ZkCatalogProverChartDataPoint, proverIds: string[]) {
  return proverIds.reduce((sum, proverId) => {
    const value = point[proverId]
    return typeof value === 'number' ? sum + value : sum
  }, 0)
}
