import { UnixTime } from '@l2beat/shared-pure'
import { createContext, useContext, useState } from 'react'
import type { ChartRange } from '~/utils/range/range'
import { optionToRange } from '~/utils/range/range'

type ActivityChartRangeContextValue = {
  range: ChartRange
  setRange: (range: ChartRange) => void
}

const ActivityChartRangeContext =
  createContext<ActivityChartRangeContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function ActivityChartRangeContextProvider({ children }: Props) {
  const [range, setRange] = useState<ChartRange>(
    optionToRange('1y', { offset: -1 * UnixTime.DAY }),
  )
  return (
    <ActivityChartRangeContext.Provider
      value={{
        range,
        setRange,
      }}
    >
      {children}
    </ActivityChartRangeContext.Provider>
  )
}

export function useActivityChartRangeContext() {
  const context = useContext(ActivityChartRangeContext)
  if (!context) {
    throw new Error(
      'ActivityChartRangeContext must be used within a ActivityChartRangeContextProvider',
    )
  }
  return context
}
