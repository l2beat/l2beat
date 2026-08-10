import type { CompareMetricId } from '../utils/compareChartState'
import { ActivityCompareChart } from './activity/ActivityCompareChart'
import { ActivityCompareControls } from './activity/ActivityCompareControls'
import { CostsCompareChart } from './costs/CostsCompareChart'
import { CostsCompareControls } from './costs/CostsCompareControls'
import { TvsCompareChart } from './tvs/TvsCompareChart'
import { TvsCompareControls } from './tvs/TvsCompareControls'
import type { CompareMetric } from './types'

export const COMPARE_METRICS: Record<CompareMetricId, CompareMetric> = {
  tvs: {
    id: 'tvs',
    label: 'Value Secured',
    Chart: TvsCompareChart,
    Controls: TvsCompareControls,
    hasData: (project) => project.tvsSinceTimestamp !== undefined,
    noDataLabel: 'No TVS data',
  },
  activity: {
    id: 'activity',
    label: 'Activity',
    Chart: ActivityCompareChart,
    Controls: ActivityCompareControls,
  },
  costs: {
    id: 'costs',
    label: 'Costs',
    Chart: CostsCompareChart,
    Controls: CostsCompareControls,
    hasData: (project) => project.costsSinceTimestamp !== undefined,
    noDataLabel: 'No costs data',
  },
}
