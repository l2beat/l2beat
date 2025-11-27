import type { ChartRange } from '~/utils/range/range'
import { ChartTimeRangeControls } from '../../core/chart/ChartTimeRangeControls'

interface Props {
  timeRange: ChartRange
  setTimeRange: (value: ChartRange) => void
}

export function TvsChartTimeRangeControls({ timeRange, setTimeRange }: Props) {
  return (
    <ChartTimeRangeControls
      name="tvsTimeRange"
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
