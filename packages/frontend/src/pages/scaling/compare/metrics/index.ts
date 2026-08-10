import type { CompareMetricId } from '../utils/compareChartState'
import { ActivityCompareChart } from './activity/ActivityCompareChart'
import { ActivityCompareControls } from './activity/ActivityCompareControls'
import { CostsCompareChart } from './costs/CostsCompareChart'
import { CostsCompareControls } from './costs/CostsCompareControls'
import { hasCostsData } from './costs/getCostsCompareChartParams'
import { DataPostedCompareChart } from './data-posted/DataPostedCompareChart'
import { hasDataPostedData } from './data-posted/getDataPostedCompareChartParams'
import { hasTvsData } from './tvs/getTvsCompareChartParams'
import { TvsCompareChart } from './tvs/TvsCompareChart'
import { TvsCompareControls } from './tvs/TvsCompareControls'
import type { CompareMetric } from './types'

export const COMPARE_METRICS: Record<CompareMetricId, CompareMetric> = {
  tvs: {
    id: 'tvs',
    label: 'Value Secured',
    Chart: TvsCompareChart,
    Controls: TvsCompareControls,
    hasData: hasTvsData,
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
    hasData: hasCostsData,
    noDataLabel: 'No costs data',
  },
  'data-posted': {
    id: 'data-posted',
    label: 'Data posted',
    Chart: DataPostedCompareChart,
    hasData: hasDataPostedData,
    noDataLabel: 'No data posted tracking',
  },
}
