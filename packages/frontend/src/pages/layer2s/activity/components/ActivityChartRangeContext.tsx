import { createContext, useContext } from 'react'
import { useQueryState } from '~/hooks/useQueryState'
import { chartRangeCodec } from '~/utils/queryParamCodecs'
import type { ChartRange } from '~/utils/range/range'

const RANGE_CODEC = chartRangeCodec('1y')

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
  const [range, setRange] = useQueryState('range', RANGE_CODEC)
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
