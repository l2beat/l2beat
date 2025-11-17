import { createContext, useContext, useState } from 'react'
import { optionToRange } from '~/components/core/chart/ChartTimeRangeControls'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'

type CostsTimeRangeContextValue = {
  range: CostsTimeRange
  setRange: (range: CostsTimeRange) => void
}

const CostsTimeRangeContext = createContext<CostsTimeRangeContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
}

export function CostsTimeRangeContextProvider({ children }: Props) {
  const [range, setRange] = useState<CostsTimeRange>(optionToRange('30d'))
  return (
    <CostsTimeRangeContext.Provider
      value={{
        range,
        setRange,
      }}
    >
      {children}
    </CostsTimeRangeContext.Provider>
  )
}

export function useCostsTimeRangeContext() {
  const context = useContext(CostsTimeRangeContext)
  if (!context) {
    throw new Error(
      'CostsTimeRangeContext must be used within a CostsTimeRangeContextProvider',
    )
  }
  return context
}
