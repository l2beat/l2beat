import { type CostsMetric } from '~/app/(side-nav)/scaling/costs/_components/costs-metric-context'
import { type CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { ChartTimeRangeControls } from '../core/chart-time-range-controls'

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
      projectSection={projectSection}
      value={timeRange}
      setValue={setTimeRange}
      options={[
        {
          value: '1d',
          label: '1D',
          disabled: metric === 'per-l2-tx',
        },
        {
          value: '7d',
          label: '7D',
          disabled: metric === 'per-l2-tx',
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
