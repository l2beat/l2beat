import { buildCompareUrl } from './buildCompareUrl'
import {
  type CompareMetricId,
  createDefaultChartConfig,
  DEFAULT_COMPARE_METRIC,
  DEFAULT_COMPARE_RANGE,
} from './compareChartState'

export const COMPARE_PAGE_PATH = '/scaling/compare'

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
