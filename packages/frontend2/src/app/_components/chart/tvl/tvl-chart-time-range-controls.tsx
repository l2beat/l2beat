import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { ChartTimeRangeControls } from '../controls/chart-time-range-controls'

export interface Props {
  timeRange: TvlChartRange
  setTimeRange: (value: TvlChartRange) => void
  range: [number, number]
}

export function TvlChartTimeRangeControls({
  timeRange,
  setTimeRange,
  range,
}: Props) {
  return (
    <ChartTimeRangeControls
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
      range={range}
    />
  )
}
