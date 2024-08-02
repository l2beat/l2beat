'use client'

import { createContext, useContext, useState } from 'react'
import { useCookieState } from '~/hooks/use-cookie-state'
import { type CostsTimeRange } from '~/server/features/costs/utils/range'

type CostsTimeRangeContextValue = {
  range: CostsTimeRange
  setRange: React.Dispatch<React.SetStateAction<CostsTimeRange>>
  disabledOptions: CostsTimeRange[] | undefined
  setDisabledOptions: React.Dispatch<
    React.SetStateAction<CostsTimeRange[] | undefined>
  >
}

const CostsTimeRangeContext = createContext<CostsTimeRangeContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
}

export function CostsTimeRangeContextProvider({ children }: Props) {
  const [range, setRange] = useCookieState('costsChartRange')
  const [disabledOptions, setDisabledOptions] = useState<CostsTimeRange[]>()
  return (
    <CostsTimeRangeContext.Provider
      value={{
        range,
        setRange,
        disabledOptions,
        setDisabledOptions,
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
