import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import { get7dTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import type { getSsrHelpers } from '~/trpc/server'
import type { ChartRange } from '~/utils/range/range'
import { getTvsCompareChartParams } from '../metrics/tvs/getTvsCompareChartParams'
import type { CompareMetricId } from '../utils/compareChartState'

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
    range: ChartRange,
  ) => Promise<void>
}

export const COMPARE_SERVER_METRICS: Record<
  CompareMetricId,
  CompareServerMetric
> = {
  tvs: {
    getDefaultProjects: async (universe, count) => {
      const tvs = await get7dTvsBreakdown({ type: 'layer2' })
      return universe
        .map((project) => ({
          project,
          tvs: tvs.projects[project.id.toString()]?.breakdown.total ?? -1,
        }))
        .sort((a, b) => b.tvs - a.tvs)
        .slice(0, count)
        .map(({ project }) => project)
    },
    prefetch: async (helpers, projects, range) => {
      await helpers.queryClient.prefetchQuery(
        helpers.trpc.tvs.detailedChartWithProjectsRanges.queryOptions(
          getTvsCompareChartParams(projects, range),
        ),
      )
    },
  },
}
