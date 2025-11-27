import type { CostsMetric } from '~/pages/scaling/costs/components/CostsMetricContext'
import type { ChartRange } from '~/utils/range/range'
import { ChartTimeRangeControls } from '../../core/chart/ChartTimeRangeControls'

interface Props {
  timeRange: ChartRange
  setTimeRange: (range: ChartRange) => void
  metric?: CostsMetric
}

export function CostsChartTimeRangeControls({
  timeRange,
  setTimeRange,
  metric,
}: Props) {
  return (
    <ChartTimeRangeControls
      name="costsTimeRange"
      value={timeRange}
      setValue={setTimeRange}
      options={[
        {
          value: '1d',
          label: '1D',
          disabled: metric === 'per-l2-uop',
        },
        {
          value: '7d',
          label: '7D',
          disabled: metric === 'per-l2-uop',
        },
        {
          value: '30d',
          label: '30D',
        },
        {
          value: '90d',
          label: '90D',
        },
        {
          value: '180d',
          label: '180D',
        },
        {
          value: '1y',
          label: '1Y',
        },
        {
          value: 'max',
          label: 'MAX',
        },
      ]}
    />
  )
}
