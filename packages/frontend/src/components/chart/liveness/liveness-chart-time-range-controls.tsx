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
