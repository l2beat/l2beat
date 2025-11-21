import { UnixTime } from '@l2beat/shared-pure'
import { createContext, useContext, useState } from 'react'
import { optionToRange } from '~/components/core/chart/ChartTimeRangeControls'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'

type ActivityTimeRangeContextValue = {
  timeRange: ActivityTimeRange
  setTimeRange: (range: ActivityTimeRange) => void
}

const ActivityTimeRangeContext =
  createContext<ActivityTimeRangeContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function ActivityTimeRangeContextProvider({ children }: Props) {
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>(
    optionToRange('1y', { offset: -1 * UnixTime.DAY }),
  )
  return (
    <ActivityTimeRangeContext.Provider
      value={{
        timeRange,
        setTimeRange,
      }}
    >
      {children}
    </ActivityTimeRangeContext.Provider>
  )
}

export function useActivityTimeRangeContext() {
  const context = useContext(ActivityTimeRangeContext)
  if (!context) {
    throw new Error(
      'ActivityTimeRangeContext must be used within a ActivityTimeRangeContextProvider',
    )
  }
  return context
}
