import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'

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
    projects: projects
      .filter((project) => project.hasDaTracking)
      .map((project) => project.id),
  }
}
