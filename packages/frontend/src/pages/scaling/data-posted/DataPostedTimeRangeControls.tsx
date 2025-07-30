import { ChartTimeRangeControls } from '~/components/core/chart/ChartTimeRangeControls'
import type { DataPostedTimeRange } from '~/server/features/scaling/data-posted/range'

interface Props {
  timeRange: DataPostedTimeRange
  setTimeRange: (timeRange: DataPostedTimeRange) => void
  projectSection?: boolean
}

export function DataPostedTimeRangeControls({
  timeRange,
  setTimeRange,
  projectSection,
}: Props) {
  return (
    <ChartTimeRangeControls
      name="dataPostedTimeRange"
      value={timeRange}
      setValue={setTimeRange}
      options={[
        { value: '1d', label: '1D' },
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
