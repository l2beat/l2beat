import { createContext, useContext, useState } from 'react'
import type { ChartRange } from '~/utils/range/range'
import { optionToRange } from '~/utils/range/range'

type L2TvsTimeRangeContextValue = {
  range: ChartRange
  setRange: (range: ChartRange) => void
}

const L2TvsTimeRangeContext = createContext<L2TvsTimeRangeContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
}

export function L2TvsTimeRangeContextProvider({ children }: Props) {
  const [range, setRange] = useState<ChartRange>(optionToRange('1y'))
  return (
    <L2TvsTimeRangeContext.Provider
      value={{
        range,
        setRange,
      }}
    >
      {children}
    </L2TvsTimeRangeContext.Provider>
  )
}

export function useL2TvsTimeRangeContext() {
  const context = useContext(L2TvsTimeRangeContext)
  if (!context) {
    throw new Error(
      'L2TvsTimeRangeContext must be used within a L2TvsTimeRangeContextProvider',
    )
  }
  return context
}
