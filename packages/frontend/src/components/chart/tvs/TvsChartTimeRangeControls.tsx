import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { ChartTimeRangeControls } from '../../core/chart/ChartTimeRangeControls'

interface Props {
  timeRange: TvsChartRange
  setTimeRange: (value: TvsChartRange) => void
  projectSection?: boolean
}

export function TvsChartTimeRangeControls({
  timeRange,
  setTimeRange,
  projectSection,
}: Props) {
  return (
    <ChartTimeRangeControls
      name="tvsTimeRange"
      projectSection={projectSection}
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
