import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'

/**
 * Whether the project has DA tracking. The single source for the picker's
 * no-data marking and the query params, so a project marked "no data" can
 * never be queried anyway (or vice versa).
 */
export function hasDataPostedData(project: CompareProjectEntry): boolean {
  return project.hasDaTracking
}

/**
 * Builds the `da.detailedChartWithProjectsRanges` input for the compare
 * chart. Shared between the SSR prefetch and the client query so the
 * hydrated cache always matches and the first paint needs no refetch.
 * Projects without DA tracking are dropped - they have no data to query.
 */
export function getDataPostedCompareChartParams(
  projects: CompareProjectEntry[],
  range: ChartRange,
) {
  return {
    range,
    projects: projects.filter(hasDataPostedData).map((project) => project.id),
  }
}
