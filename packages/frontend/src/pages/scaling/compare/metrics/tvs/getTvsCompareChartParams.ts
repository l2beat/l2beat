import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import {
  type CompareChartClientConfig,
  effectiveExcludeRwaRestrictedTokens,
} from '../../utils/compareChartState'

/**
 * Whether the project has TVS tracking. The single source for the picker's
 * no-data marking and the query params, so a project marked "no data" can
 * never be queried anyway (or vice versa).
 */
export function hasTvsData(
  project: CompareProjectEntry,
): project is CompareProjectEntry & { tvsSinceTimestamp: number } {
  return project.tvsSinceTimestamp !== undefined
}

/**
 * Builds the `tvs.detailedChartWithProjectsRanges` input for the compare
 * chart. Shared between the SSR prefetch and the client query so the
 * hydrated cache always matches and the first paint needs no refetch.
 */
export function getTvsCompareChartParams(
  projects: CompareProjectEntry[],
  state: Pick<
    CompareChartClientConfig,
    | 'chartRange'
    | 'tvsFilter'
    | 'excludeAssociatedTokens'
    | 'excludeRwaRestrictedTokens'
  >,
) {
  return {
    range: state.chartRange,
    excludeAssociatedTokens: state.excludeAssociatedTokens,
    excludeRwaRestrictedTokens: effectiveExcludeRwaRestrictedTokens(state),
    projects: projects.filter(hasTvsData).map((project) => ({
      projectId: project.id,
      sinceTimestamp: project.tvsSinceTimestamp,
    })),
  }
}
