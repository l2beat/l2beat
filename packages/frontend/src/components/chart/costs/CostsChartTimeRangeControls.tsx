import type { CostsMetric } from '~/pages/scaling/costs/components/CostsMetricContext'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { ChartTimeRangeControls } from '../../core/chart/ChartTimeRangeControls'

interface Props {
  timeRange: CostsTimeRange
  setTimeRange: (range: CostsTimeRange) => void
  metric?: CostsMetric
  projectSection?: boolean
}

export function CostsChartTimeRangeControls({
  timeRange,
  setTimeRange,
  metric,
  projectSection,
}: Props) {
  return (
    <ChartTimeRangeControls
      name="costsTimeRange"
      projectSection={projectSection}
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
