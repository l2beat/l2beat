import { createContext, useContext, useState } from 'react'
import type { ChartRange } from '~/utils/range/range'
import { optionToRange } from '~/utils/range/range'

type ScalingTvsTimeRangeContextValue = {
  range: ChartRange
  setRange: (range: ChartRange) => void
}

const ScalingTvsTimeRangeContext =
  createContext<ScalingTvsTimeRangeContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function ScalingTvsTimeRangeContextProvider({ children }: Props) {
  const [range, setRange] = useState<ChartRange>(optionToRange('1y'))
  return (
    <ScalingTvsTimeRangeContext.Provider
      value={{
        range,
        setRange,
      }}
    >
      {children}
    </ScalingTvsTimeRangeContext.Provider>
  )
}

export function useScalingTvsTimeRangeContext() {
  const context = useContext(ScalingTvsTimeRangeContext)
  if (!context) {
    throw new Error(
      'ScalingTvsTimeRangeContext must be used within a ScalingTvsTimeRangeContextProvider',
    )
  }
  return context
}
