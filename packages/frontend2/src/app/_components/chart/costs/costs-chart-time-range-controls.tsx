import { useCostsMetricContext } from '~/app/(new)/(other)/scaling/costs/_components/costs-metric-context'
import { type CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { ChartTimeRangeControls } from '../core/chart-time-range-controls'

interface Props {
  timeRange: CostsTimeRange
  setTimeRange: (range: CostsTimeRange) => void
  range: [number, number]
}

export function CostsChartTimeRangeControls({
  timeRange,
  setTimeRange,
  range,
}: Props) {
  const { metric } = useCostsMetricContext()
  return (
    <ChartTimeRangeControls
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
      ]}
      range={range}
    />
  )
}
