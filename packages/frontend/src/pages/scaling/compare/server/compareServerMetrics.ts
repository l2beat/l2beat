import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { getSsrHelpers } from '~/trpc/server'
import { getActivityCompareChartParams } from '../metrics/activity/getActivityCompareChartParams'
import { getCostsCompareChartParams } from '../metrics/costs/getCostsCompareChartParams'
import { getDataPostedCompareChartParams } from '../metrics/data-posted/getDataPostedCompareChartParams'
import { getTvsCompareChartParams } from '../metrics/tvs/getTvsCompareChartParams'
import type {
  CompareChartClientConfig,
  CompareMetricId,
} from '../utils/compareChartState'

type SsrHelpers = ReturnType<typeof getSsrHelpers>

/**
 * Server-side half of the metric registry: the SSR prefetch per metric.
 * Keyed by the same ids as `COMPARE_METRICS`.
 */
interface CompareServerMetric {
  prefetch: (
    helpers: SsrHelpers,
    projects: CompareProjectEntry[],
    config: CompareChartClientConfig,
  ) => Promise<void>
}

export const COMPARE_SERVER_METRICS: Record<
  CompareMetricId,
  CompareServerMetric
> = {
  tvs: {
    prefetch: async (helpers, projects, config) => {
      await helpers.queryClient.prefetchQuery(
        helpers.trpc.tvs.detailedChartWithProjectsRanges.queryOptions(
          getTvsCompareChartParams(projects, config),
        ),
      )
    },
  },
  activity: {
    prefetch: async (helpers, projects, config) => {
      await helpers.queryClient.prefetchQuery(
        helpers.trpc.activity.detailedChartWithProjectsRanges.queryOptions(
          getActivityCompareChartParams(projects, config.chartRange),
        ),
      )
    },
  },
  costs: {
    prefetch: async (helpers, projects, config) => {
      await helpers.queryClient.prefetchQuery(
        helpers.trpc.costs.detailedChartWithProjectsRanges.queryOptions(
          getCostsCompareChartParams(projects, config.chartRange),
        ),
      )
    },
  },
  'data-posted': {
    prefetch: async (helpers, projects, config) => {
      await helpers.queryClient.prefetchQuery(
        helpers.trpc.da.detailedChartWithProjectsRanges.queryOptions(
          getDataPostedCompareChartParams(projects, config.chartRange),
        ),
      )
    },
  },
}
