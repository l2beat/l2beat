import { getProjectsDataPosted } from '~/server/features/data-availability/throughput/getProjectsDataPosted'
import { getActivityLatestUops } from '~/server/features/scaling/activity/getActivityLatestTps'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import { getCostsTotalUsdForProjects } from '~/server/features/scaling/costs/getCostsTotalUsdForProjects'
import type { getSsrHelpers } from '~/trpc/server'
import { optionToRange } from '~/utils/range/range'
import { getActivityCompareChartParams } from '../metrics/activity/getActivityCompareChartParams'
import { getCostsCompareChartParams } from '../metrics/costs/getCostsCompareChartParams'
import { getDataPostedCompareChartParams } from '../metrics/data-posted/getDataPostedCompareChartParams'
import { getTvsCompareChartParams } from '../metrics/tvs/getTvsCompareChartParams'
import type {
  CompareClientState,
  CompareMetricId,
} from '../utils/compareChartState'

type SsrHelpers = ReturnType<typeof getSsrHelpers>

/**
 * Server-side half of the metric registry: default top-N ranking and the
 * SSR prefetch. Keyed by the same ids as `COMPARE_METRICS`.
 */
interface CompareServerMetric {
  getDefaultProjects: (
    universe: CompareProjectEntry[],
    count: number,
  ) => Promise<CompareProjectEntry[]>
  prefetch: (
    helpers: SsrHelpers,
    projects: CompareProjectEntry[],
    state: CompareClientState,
  ) => Promise<void>
}

export const COMPARE_SERVER_METRICS: Record<
  CompareMetricId,
  CompareServerMetric
> = {
  tvs: {
    // The universe is already ordered by TVS descending.
    getDefaultProjects: async (universe, count) => universe.slice(0, count),
    prefetch: async (helpers, projects, state) => {
      await helpers.queryClient.prefetchQuery(
        helpers.trpc.tvs.detailedChartWithProjectsRanges.queryOptions(
          getTvsCompareChartParams(projects, state),
        ),
      )
    },
  },
  activity: {
    getDefaultProjects: async (universe, count) => {
      // The ranking only needs the latest daily counts, so a short range
      // keeps the query far cheaper than the summary page's 1y default.
      const uops = await getActivityLatestUops(universe, optionToRange('30d'))
      return universe
        .map((project) => ({
          project,
          uops: uops[project.id.toString()]?.pastDayUops ?? -1,
        }))
        .sort((a, b) => b.uops - a.uops)
        .slice(0, count)
        .map(({ project }) => project)
    },
    prefetch: async (helpers, projects, state) => {
      await helpers.queryClient.prefetchQuery(
        helpers.trpc.activity.detailedChartWithProjectsRanges.queryOptions(
          getActivityCompareChartParams(projects, state.chartRange),
        ),
      )
    },
  },
  costs: {
    getDefaultProjects: async (universe, count) => {
      // Only projects with costs tracking can rank; the recent window keeps
      // the query cheap while still reflecting current spending.
      const tracked = universe.filter(
        (project) => project.costsSinceTimestamp !== undefined,
      )
      const totals = await getCostsTotalUsdForProjects(
        tracked,
        optionToRange('30d'),
      )
      return tracked
        .map((project) => ({
          project,
          usd: totals[project.id.toString()] ?? -1,
        }))
        .sort((a, b) => b.usd - a.usd)
        .slice(0, count)
        .map(({ project }) => project)
    },
    prefetch: async (helpers, projects, state) => {
      await helpers.queryClient.prefetchQuery(
        helpers.trpc.costs.detailedChartWithProjectsRanges.queryOptions(
          getCostsCompareChartParams(projects, state.chartRange),
        ),
      )
    },
  },
  'data-posted': {
    getDefaultProjects: async (universe, count) => {
      const tracked = universe.filter((project) => project.hasDaTracking)
      const dataPosted = await getProjectsDataPosted(
        tracked.map((project) => project.id),
      )
      return tracked
        .map((project) => ({
          project,
          pastDay: dataPosted[project.id.toString()]?.pastDay ?? -1,
        }))
        .sort((a, b) => b.pastDay - a.pastDay)
        .slice(0, count)
        .map(({ project }) => project)
    },
    prefetch: async (helpers, projects, state) => {
      await helpers.queryClient.prefetchQuery(
        helpers.trpc.da.detailedChartWithProjectsRanges.queryOptions(
          getDataPostedCompareChartParams(projects, state.chartRange),
        ),
      )
    },
  },
}
