import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'

/**
 * Builds the `costs.detailedChartWithProjectsRanges` input for the compare
 * chart. Shared between the SSR prefetch and the client query so the
 * hydrated cache always matches and the first paint needs no refetch.
 * Projects without costs tracking are left out entirely, so they can never
 * come back as an empty series.
 */
export function getCostsCompareChartParams(
  projects: CompareProjectEntry[],
  chartRange: ChartRange,
) {
  return {
    range: chartRange,
    projects: projects.flatMap((project) =>
      project.costsSinceTimestamp !== undefined
        ? [
            {
              projectId: project.id,
              sinceTimestamp: project.costsSinceTimestamp,
            },
          ]
        : [],
    ),
  }
}
