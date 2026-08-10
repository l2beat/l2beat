import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { CompareClientState } from '../../utils/compareChartState'

/**
 * Builds the `tvs.detailedChartWithProjectsRanges` input for the compare
 * chart. Shared between the SSR prefetch and the client query so the
 * hydrated cache always matches and the first paint needs no refetch.
 */
export function getTvsCompareChartParams(
  projects: CompareProjectEntry[],
  state: Pick<
    CompareClientState,
    'chartRange' | 'excludeAssociatedTokens' | 'excludeRwaRestrictedTokens'
  >,
) {
  return {
    range: state.chartRange,
    excludeAssociatedTokens: state.excludeAssociatedTokens,
    excludeRwaRestrictedTokens: state.excludeRwaRestrictedTokens,
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
