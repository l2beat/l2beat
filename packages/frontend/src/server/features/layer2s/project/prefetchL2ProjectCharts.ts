import type { ProjectId, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { getDefaultSubtype } from '~/components/chart/liveness/getDefaultSubtype'
import type { SsrHelpers } from '~/trpc/server'
import type { ChartRange } from '~/utils/range/range'

interface ChartSections {
  tvs: { defaultRange: ChartRange } | undefined
  activity: { defaultRange: ChartRange } | undefined
  costs: { defaultRange: ChartRange } | undefined
  dataPosted: { defaultRange: ChartRange } | undefined
  liveness:
    | {
        defaultRange: ChartRange
        configuredSubtypes: TrackedTxsConfigSubtype[]
      }
    | undefined
}

/**
 * Charts render on the server only when their data is in the dehydrated
 * state under the input of their first browser render, so these mirror the
 * queries in the project page's chart components.
 */
export async function prefetchL2ProjectCharts(
  helpers: SsrHelpers,
  projectId: ProjectId,
  sections: ChartSections,
) {
  const { queryClient, trpc } = helpers
  const { tvs, activity, costs, dataPosted, liveness } = sections
  await Promise.all([
    tvs &&
      queryClient.prefetchQuery(
        trpc.tvs.detailedChart.queryOptions({
          filter: { type: 'projects', projectIds: [projectId] },
          range: tvs.defaultRange,
          excludeAssociatedTokens: false,
          excludeRwaRestrictedTokens: true,
        }),
      ),
    activity &&
      queryClient.prefetchQuery(
        trpc.activity.chart.queryOptions({
          range: activity.defaultRange,
          filter: { type: 'projects', projectIds: [projectId] },
        }),
      ),
    costs &&
      queryClient.prefetchQuery(
        trpc.costs.projectChart.queryOptions({
          range: costs.defaultRange,
          projectId,
        }),
      ),
    dataPosted &&
      queryClient.prefetchQuery(
        trpc.da.l2ProjectChart.queryOptions({
          range: dataPosted.defaultRange,
          projectId,
        }),
      ),
    liveness &&
      queryClient.prefetchQuery(
        trpc.liveness.projectChart.queryOptions({
          projectId,
          range: liveness.defaultRange,
          subtype: getDefaultSubtype(liveness.configuredSubtypes),
        }),
      ),
  ])
}
