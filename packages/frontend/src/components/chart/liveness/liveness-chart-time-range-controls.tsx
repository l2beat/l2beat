import type { LivenessProjectTimeRange } from '~/server/features/scaling/liveness/utils/range'
import { ChartTimeRangeControls } from '../../core/chart/chart-time-range-controls'

interface Props {
  timeRange: LivenessProjectTimeRange
  setTimeRange: (range: LivenessProjectTimeRange) => void
  projectSection?: boolean
}

export function LivenessChartTimeRangeControls({
  timeRange,
  setTimeRange,
  projectSection,
}: Props) {
  return (
    <ChartTimeRangeControls
      name="livenessTimeRange"
      projectSection={projectSection}
      value={timeRange}
      setValue={setTimeRange}
      options={[
        {
          value: '7d',
          label: '7D',
        },
      ]}
    />
  )
}
