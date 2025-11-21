import { UnixTime } from '@l2beat/shared-pure'
import { ChartTimeRangeControls } from '~/components/core/chart/ChartTimeRangeControls'
import type { ChartRange } from '~/utils/range/range'

interface Props {
  timeRange: ChartRange
  setTimeRange: (timeRange: ChartRange) => void
  projectSection?: boolean
}

export function ActivityTimeRangeControls({
  timeRange,
  setTimeRange,
  projectSection,
}: Props) {
  return (
    <ChartTimeRangeControls
      name="activityTimeRange"
      value={timeRange}
      setValue={setTimeRange}
      options={[
        { value: '30d', label: '30D' },
        { value: '90d', label: '90D' },
        { value: '180d', label: '180D' },
        { value: '1y', label: '1Y' },
        { value: 'max', label: 'MAX' },
      ]}
      projectSection={projectSection}
      offset={-1 * UnixTime.DAY}
    />
  )
}
