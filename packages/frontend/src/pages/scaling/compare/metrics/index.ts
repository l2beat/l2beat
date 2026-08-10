import type { CompareMetricId } from '../utils/compareChartState'
import { ActivityCompareChart } from './activity/ActivityCompareChart'
import { ActivityCompareControls } from './activity/ActivityCompareControls'
import { TvsCompareChart } from './tvs/TvsCompareChart'
import type { CompareMetric } from './types'

export const COMPARE_METRICS: Record<CompareMetricId, CompareMetric> = {
  tvs: {
    id: 'tvs',
    label: 'Value Secured',
    Chart: TvsCompareChart,
  },
  activity: {
    id: 'activity',
    label: 'Activity',
    Chart: ActivityCompareChart,
    Controls: ActivityCompareControls,
  },
}
