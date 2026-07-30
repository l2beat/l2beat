import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'

/**
 * Builds the `tvs.detailedChartWithProjectsRanges` input for the compare
 * chart. Shared between the SSR prefetch and the client query so the
 * hydrated cache always matches and the first paint needs no refetch.
 */
export function getTvsCompareChartParams(
  projects: CompareProjectEntry[],
  range: ChartRange,
) {
  return {
    range,
    // Matches the TVS page defaults; control parity is a follow-up ticket.
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens: true,
    projects: projects.flatMap((project) =>
      project.tvsSinceTimestamp !== undefined
        ? [
            {
              projectId: project.id,
              sinceTimestamp: project.tvsSinceTimestamp,
            },
          ]
        : [],
    ),
  }
}
