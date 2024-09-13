'use client'

import { ChartTimeRangeControls } from '~/components/chart/core/chart-time-range-controls'
import { type ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'

interface Props {
  timeRange: ActivityTimeRange
  setTimeRange: (timeRange: ActivityTimeRange) => void
  range: [number, number]
}

export function ActivityTimeRangeControls({
  timeRange,
  setTimeRange,
  range,
}: Props) {
  return (
    <ChartTimeRangeControls
      value={timeRange}
      setValue={setTimeRange}
      options={[
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
