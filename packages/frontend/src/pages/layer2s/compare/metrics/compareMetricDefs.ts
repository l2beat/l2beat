import type { CompareMetricId } from '../utils/compareChartState'
import { activityCompareMetric } from './activity/activityCompareMetric'
import { costsCompareMetric } from './costs/costsCompareMetric'
import { dataPostedCompareMetric } from './data-posted/dataPostedCompareMetric'
import { tvsCompareMetric } from './tvs/tvsCompareMetric'
import type { CompareMetricDef } from './types'

/**
 * The pure metric registry: URL codecs, SSR prefetch and data availability
 * per metric, with no React. `COMPARE_METRICS` extends it with components.
 */
export const COMPARE_METRIC_DEFS: Record<CompareMetricId, CompareMetricDef> = {
  tvs: tvsCompareMetric,
  activity: activityCompareMetric,
  costs: costsCompareMetric,
  'data-posted': dataPostedCompareMetric,
}
