import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
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
      tvsUnit: parseOneOf(
        fields.unit,
        COMPARE_TVS_UNITS,
        DEFAULT_COMPARE_TVS_UNIT,
      ),
      tvsFilter: parseOneOf(
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
    }),
    serialize: (controls) => {
      const fields: CompareUrlFields = {}
      if (controls.tvsUnit !== DEFAULT_COMPARE_TVS_UNIT) {
        fields.unit = controls.tvsUnit
      }
      if (controls.tvsFilter !== DEFAULT_COMPARE_TVS_FILTER) {
        fields.filter = controls.tvsFilter
      }
      if (
        controls.excludeAssociatedTokens !==
        DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS
      ) {
        fields.excludeAssociated = String(controls.excludeAssociatedTokens)
      }
      // The exclude-restricted-RWA toggle is disabled and overridden while
      // the Restricted RWAs filter is active, so its value is not encoded.
      if (
        controls.tvsFilter !== 'rwaRestricted' &&
        controls.excludeRwaRestrictedTokens !==
          DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS
      ) {
        fields.excludeRwa = String(controls.excludeRwaRestrictedTokens)
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
  config: Pick<
    CompareChartConfig,
    'tvsFilter' | 'excludeAssociatedTokens' | 'excludeRwaRestrictedTokens'
  >,
  chartRange: ChartRange,
) {
  return {
    range: chartRange,
    excludeAssociatedTokens: config.excludeAssociatedTokens,
    excludeRwaRestrictedTokens: effectiveExcludeRwaRestrictedTokens(config),
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
export function effectiveExcludeRwaRestrictedTokens(config: {
  tvsFilter: CompareTvsFilter
  excludeRwaRestrictedTokens: boolean
}): boolean {
  return config.tvsFilter === 'rwaRestricted'
    ? false
    : config.excludeRwaRestrictedTokens
}
