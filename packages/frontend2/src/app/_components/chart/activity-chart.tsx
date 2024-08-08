'use client'

import { useActivityTimeRangeContext } from '~/app/(new)/(other)/scaling/activity/_components/activity-time-range-context'
import { ActivityTimeRangeControls } from '~/app/(new)/(other)/scaling/activity/_components/activity-time-range-controls'

export function ActivityChart() {
  const { timeRange, setTimeRange } = useActivityTimeRangeContext()

  return (
    <ActivityTimeRangeControls
      timeRange={timeRange}
      setTimeRange={setTimeRange}
    />
  )
}
