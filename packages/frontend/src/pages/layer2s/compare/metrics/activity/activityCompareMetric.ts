import type { CompareProjectEntry } from '~/server/features/layer2s/compare/getCompareProjectEntries'
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
  hasData: hasActivityData,
  noDataLabel: 'No activity data',
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
 * Whether the project has activity tracking. The single source for the
 * picker's no-data marking and the query params, so a project marked
 * "no data" can never be queried anyway (or vice versa).
 */
export function hasActivityData(project: CompareProjectEntry): boolean {
  return project.hasActivityTracking
}

/**
 * Builds the `activity.detailedChartWithProjectsRanges` input for the compare
 * chart. Shared between the SSR prefetch and the client query so the
 * hydrated cache always matches and the first paint needs no refetch.
 * Projects without activity tracking are dropped - they have no data to
 * query, and stale historical rows must not render as a series.
 */
export function getActivityCompareChartParams(
  projects: CompareProjectEntry[],
  range: ChartRange,
) {
  return {
    range,
    projects: projects.filter(hasActivityData).map((project) => project.id),
  }
}
