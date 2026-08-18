import { buildCompareUrl } from './buildCompareUrl'
import {
  type CompareMetricId,
  createDefaultChartConfig,
  DEFAULT_COMPARE_METRIC,
  DEFAULT_COMPARE_RANGE,
} from './compareChartState'

export const COMPARE_PAGE_PATH = '/scaling/compare'

/**
 * The URL an entry point (sidebar, metric page button, project section link)
 * sends the user to: the compare page with a single chart of `metric` and
 * `projectSlug` (if any) pre-selected, so they only have to add comparators.
 * Built with `buildCompareUrl` so defaults are omitted and the bare TVS entry
 * stays `/scaling/compare`.
 */
export function getCompareEntryUrl({
  metric = DEFAULT_COMPARE_METRIC,
  projectSlug,
}: {
  metric?: CompareMetricId
  projectSlug?: string
} = {}): string {
  return buildCompareUrl(COMPARE_PAGE_PATH, {
    projects: projectSlug ? [projectSlug] : [],
    range: DEFAULT_COMPARE_RANGE,
    charts: [createDefaultChartConfig(metric)],
  })
}
