import type { CompareMetricId } from '../utils/compareChartState'
import { TvsCompareChart } from './tvs/TvsCompareChart'
import type { CompareMetric } from './types'

export const COMPARE_METRICS: Record<CompareMetricId, CompareMetric> = {
  tvs: {
    id: 'tvs',
    label: 'Value Secured',
    unit: 'usd',
    Chart: TvsCompareChart,
  },
}
