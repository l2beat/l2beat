import type { CompareProjectEntry } from '~/server/features/layer2s/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'
import {
  COMPARE_TVS_FILTERS,
  COMPARE_TVS_UNITS,
  type CompareChartConfig,
  type CompareTvsFilter,
  DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS,
  DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS,
  DEFAULT_COMPARE_TVS_FILTER,
  DEFAULT_COMPARE_TVS_UNIT,
} from '../../utils/compareChartState'
import { parseBoolean, parseOneOf } from '../../utils/urlFields'
import type { CompareMetricDef, CompareUrlFields } from '../types'

export const tvsCompareMetric: CompareMetricDef = {
  id: 'tvs',
  label: 'Value Secured',
  hasData: hasTvsData,
  noDataLabel: 'No TVS data',
  urlControls: {
    parse: (fields) => ({
      tvs: {
        unit: parseOneOf(
          fields.unit,
          COMPARE_TVS_UNITS,
          DEFAULT_COMPARE_TVS_UNIT,
        ),
        filter: parseOneOf(
          fields.filter,
          COMPARE_TVS_FILTERS,
          DEFAULT_COMPARE_TVS_FILTER,
        ),
        excludeAssociatedTokens: parseBoolean(
          fields.excludeAssociated,
          DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS,
        ),
        excludeRwaRestrictedTokens: parseBoolean(
          fields.excludeRwa,
          DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS,
        ),
      },
    }),
    serialize: ({ tvs }) => {
      const fields: CompareUrlFields = {}
      if (tvs.unit !== DEFAULT_COMPARE_TVS_UNIT) {
        fields.unit = tvs.unit
      }
      if (tvs.filter !== DEFAULT_COMPARE_TVS_FILTER) {
        fields.filter = tvs.filter
      }
      if (
        tvs.excludeAssociatedTokens !==
        DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS
      ) {
        fields.excludeAssociated = String(tvs.excludeAssociatedTokens)
      }
      // The exclude-restricted-RWA toggle is disabled and overridden while
      // the Restricted RWAs filter is active, so its value is not encoded.
      if (
        tvs.filter !== 'rwaRestricted' &&
        tvs.excludeRwaRestrictedTokens !==
          DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS
      ) {
        fields.excludeRwa = String(tvs.excludeRwaRestrictedTokens)
      }
      return fields
    },
  },
  prefetch: async (helpers, projects, config, chartRange) => {
    await helpers.queryClient.prefetchQuery(
      helpers.trpc.tvs.detailedChartWithProjectsRanges.queryOptions(
        getTvsCompareChartParams(projects, config, chartRange),
      ),
    )
  },
}

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
  { tvs }: Pick<CompareChartConfig, 'tvs'>,
  chartRange: ChartRange,
) {
  return {
    range: chartRange,
    excludeAssociatedTokens: tvs.excludeAssociatedTokens,
    excludeRwaRestrictedTokens: effectiveExcludeRwaRestrictedTokens(tvs),
    projects: projects.filter(hasTvsData).map((project) => ({
      projectId: project.id,
      sinceTimestamp: project.tvsSinceTimestamp,
    })),
  }
}

/**
 * The exclude-restricted-RWA toggle conflicts with the Restricted RWAs
 * filter: combined they would render an all-zero chart. While that filter is
 * active the toggle is disabled and overridden to false; the stored value is
 * kept so switching the filter away restores the user's choice.
 */
export function effectiveExcludeRwaRestrictedTokens(tvs: {
  filter: CompareTvsFilter
  excludeRwaRestrictedTokens: boolean
}): boolean {
  return tvs.filter === 'rwaRestricted' ? false : tvs.excludeRwaRestrictedTokens
}
