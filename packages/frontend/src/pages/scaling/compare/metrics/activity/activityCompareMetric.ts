import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'
import {
  COMPARE_ACTIVITY_UNITS,
  DEFAULT_COMPARE_ACTIVITY_UNIT,
} from '../../utils/compareChartState'
import { parseOneOf } from '../../utils/urlFields'
import type { CompareMetricDef, CompareUrlFields } from '../types'

export const activityCompareMetric: CompareMetricDef = {
  id: 'activity',
  label: 'Activity',
  urlControls: {
    parse: (fields) => ({
      activityUnit: parseOneOf(
        fields.unit,
        COMPARE_ACTIVITY_UNITS,
        DEFAULT_COMPARE_ACTIVITY_UNIT,
      ),
    }),
    serialize: (controls): CompareUrlFields =>
      controls.activityUnit !== DEFAULT_COMPARE_ACTIVITY_UNIT
        ? { unit: controls.activityUnit }
        : {},
  },
  prefetch: async (helpers, projects, _config, chartRange) => {
    await helpers.queryClient.prefetchQuery(
      helpers.trpc.activity.detailedChartWithProjectsRanges.queryOptions(
        getActivityCompareChartParams(projects, chartRange),
      ),
    )
  },
}

/**
 * Builds the `activity.detailedChartWithProjectsRanges` input for the compare
 * chart. Shared between the SSR prefetch and the client query so the
 * hydrated cache always matches and the first paint needs no refetch.
 */
export function getActivityCompareChartParams(
  projects: CompareProjectEntry[],
  range: ChartRange,
) {
  return {
    range,
    projects: projects.map((project) => project.id),
  }
}
