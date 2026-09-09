import type { CompareMetricId } from '../utils/compareChartState'
import { ActivityCompareChart } from './activity/ActivityCompareChart'
import { ActivityCompareControls } from './activity/ActivityCompareControls'
import { COMPARE_METRIC_DEFS } from './compareMetricDefs'
import { CostsCompareChart } from './costs/CostsCompareChart'
import { CostsCompareControls } from './costs/CostsCompareControls'
import { DataPostedCompareChart } from './data-posted/DataPostedCompareChart'
import { TvsCompareChart } from './tvs/TvsCompareChart'
import { TvsCompareControls } from './tvs/TvsCompareControls'
import type { CompareMetric } from './types'

export const COMPARE_METRICS: Record<CompareMetricId, CompareMetric> = {
  tvs: {
    ...COMPARE_METRIC_DEFS.tvs,
    Chart: TvsCompareChart,
    Controls: TvsCompareControls,
  },
  activity: {
    ...COMPARE_METRIC_DEFS.activity,
    Chart: ActivityCompareChart,
    Controls: ActivityCompareControls,
  },
  costs: {
    ...COMPARE_METRIC_DEFS.costs,
    Chart: CostsCompareChart,
    Controls: CostsCompareControls,
  },
  'data-posted': {
    ...COMPARE_METRIC_DEFS['data-posted'],
    Chart: DataPostedCompareChart,
  },
}
