import { ChartTimeRangeControls } from '~/components/core/chart/ChartTimeRangeControls'
import type { ChartRange } from '~/utils/range/range'

interface Props {
  timeRange: ChartRange
  setTimeRange: (timeRange: ChartRange) => void
}

export function LivenessChartTimeRangeControls({
  timeRange,
  setTimeRange,
}: Props) {
  return (
    <ChartTimeRangeControls
      name="liveness"
      value={timeRange}
      setValue={setTimeRange}
      options={[
        { value: '7d', label: '7D' },
        { value: '30d', label: '30D' },
        { value: '90d', label: '90D' },
        { value: '180d', label: '180D' },
        { value: '1y', label: '1Y' },
        { value: 'max', label: 'MAX' },
      ]}
    />
  )
}
