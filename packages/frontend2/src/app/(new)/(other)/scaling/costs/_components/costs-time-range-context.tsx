'use client'

import { createContext, useContext } from 'react'
import { useCookieState } from '~/hooks/use-cookie-state'
import { type CostsTimeRange } from '~/server/features/costs/utils/range'

type CostsTimeRangeContextValue = {
  range: CostsTimeRange
  setRange: React.Dispatch<React.SetStateAction<CostsTimeRange>>
}

const CostsTimeRangeContext = createContext<CostsTimeRangeContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
}

export function CostsTimeRangeContextProvider({ children }: Props) {
  const [range, setRange] = useCookieState('costsChartRange')
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
