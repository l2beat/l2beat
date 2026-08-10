import type { CompareMetricId } from '../utils/compareChartState'
import { ActivityCompareChart } from './activity/ActivityCompareChart'
import { ActivityCompareControls } from './activity/ActivityCompareControls'
import { DataPostedCompareChart } from './data-posted/DataPostedCompareChart'
import { TvsCompareChart } from './tvs/TvsCompareChart'
import { TvsCompareControls } from './tvs/TvsCompareControls'
import type { CompareMetric } from './types'

export const COMPARE_METRICS: Record<CompareMetricId, CompareMetric> = {
  tvs: {
    id: 'tvs',
    label: 'Value Secured',
    Chart: TvsCompareChart,
    Controls: TvsCompareControls,
  },
  activity: {
    id: 'activity',
    label: 'Activity',
    Chart: ActivityCompareChart,
    Controls: ActivityCompareControls,
  },
  'data-posted': {
    id: 'data-posted',
    label: 'Data posted',
    Chart: DataPostedCompareChart,
    isProjectAvailable: (project) => project.hasDaTracking,
    unavailableReason: 'No data posted tracking',
  },
}
