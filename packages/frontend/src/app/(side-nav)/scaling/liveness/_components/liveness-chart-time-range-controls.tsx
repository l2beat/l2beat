'use client'

import type { LivenessChartTimeRange } from 'rewrite/src/server/features/scaling/liveness/utils/chart-range'
import { ChartTimeRangeControls } from '~/components/core/chart/chart-time-range-controls'

interface Props {
  timeRange: LivenessChartTimeRange
  setTimeRange: (timeRange: LivenessChartTimeRange) => void
  projectSection?: boolean
}

export function LivenessChartTimeRangeControls({
  timeRange,
  setTimeRange,
  projectSection,
}: Props) {
  return (
    <ChartTimeRangeControls
      name="livenessChartTimeRange"
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
      projectSection={projectSection}
    />
  )
}
