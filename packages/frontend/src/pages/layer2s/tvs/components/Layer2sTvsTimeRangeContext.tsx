import { createContext, useContext, useState } from 'react'
import type { ChartRange } from '~/utils/range/range'
import { optionToRange } from '~/utils/range/range'

type Layer2sTvsTimeRangeContextValue = {
  range: ChartRange
  setRange: (range: ChartRange) => void
}

const Layer2sTvsTimeRangeContext =
  createContext<Layer2sTvsTimeRangeContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function Layer2sTvsTimeRangeContextProvider({ children }: Props) {
  const [range, setRange] = useState<ChartRange>(optionToRange('1y'))
  return (
    <Layer2sTvsTimeRangeContext.Provider
      value={{
        range,
        setRange,
      }}
    >
      {children}
    </Layer2sTvsTimeRangeContext.Provider>
  )
}

export function useLayer2sTvsTimeRangeContext() {
  const context = useContext(Layer2sTvsTimeRangeContext)
  if (!context) {
    throw new Error(
      'Layer2sTvsTimeRangeContext must be used within a Layer2sTvsTimeRangeContextProvider',
    )
  }
  return context
}
