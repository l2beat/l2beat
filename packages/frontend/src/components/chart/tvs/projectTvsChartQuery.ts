import type { DetailedTvsChartDataParams } from '~/server/features/layer2s/tvs/getDetailedTvsChart'
import type { ChartRange } from '~/utils/range/range'

/** RWA restricted tokens stay hidden until the reader opts in */
export const DEFAULT_EXCLUDE_RWA_RESTRICTED_TOKENS = true

/**
 * The query behind a project page's stacked TVS charts. The server prefetches
 * it for the chart caption, so both sides must build it here for the client
 * to find the prefetched data under the same key.
 */
export function getProjectTvsChartQuery(
  projectId: string,
  range: ChartRange,
  excludeRwaRestrictedTokens: boolean,
): DetailedTvsChartDataParams {
  return {
    filter: { type: 'projects', projectIds: [projectId] },
    range,
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens,
  }
}
