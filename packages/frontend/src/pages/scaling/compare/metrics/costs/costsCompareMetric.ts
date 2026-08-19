import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'
import {
  COMPARE_COSTS_UNITS,
  DEFAULT_COMPARE_COSTS_UNIT,
} from '../../utils/compareChartState'
import { parseOneOf } from '../../utils/urlFields'
import type { CompareMetricDef, CompareUrlFields } from '../types'

export const costsCompareMetric: CompareMetricDef = {
  id: 'costs',
  label: 'Costs',
  hasData: hasCostsData,
  noDataLabel: 'No costs data',
  urlControls: {
    parse: (fields) => ({
      costsUnit: parseOneOf(
        fields.unit,
        COMPARE_COSTS_UNITS,
        DEFAULT_COMPARE_COSTS_UNIT,
      ),
    }),
    serialize: (controls): CompareUrlFields =>
      controls.costsUnit !== DEFAULT_COMPARE_COSTS_UNIT
        ? { unit: controls.costsUnit }
        : {},
  },
  prefetch: async (helpers, projects, _config, chartRange) => {
    await helpers.queryClient.prefetchQuery(
      helpers.trpc.costs.detailedChartWithProjectsRanges.queryOptions(
        getCostsCompareChartParams(projects, chartRange),
      ),
    )
  },
}

/**
 * Whether the project has onchain costs tracking. The single source for the
 * picker's no-data marking and the query params, so a project marked
 * "no data" can never be queried anyway (or vice versa).
 */
export function hasCostsData(
  project: CompareProjectEntry,
): project is CompareProjectEntry & { costsSinceTimestamp: number } {
  return project.costsSinceTimestamp !== undefined
}

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
    projects: projects.filter(hasCostsData).map((project) => ({
      projectId: project.id,
      sinceTimestamp: project.costsSinceTimestamp,
    })),
  }
}
