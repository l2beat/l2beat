import { createContext, useContext, useState } from 'react'
import type { ChartUnit } from '~/components/chart/types'
import type { ChartRange } from '~/utils/range/range'

type TvsChartControlsContextValue = {
  unit: ChartUnit
  setUnit: React.Dispatch<React.SetStateAction<ChartUnit>>
  range: ChartRange
  setRange: React.Dispatch<React.SetStateAction<ChartRange>>
}

const TvsChartControlsContext =
  createContext<TvsChartControlsContextValue | null>(null)

interface Props {
  children: React.ReactNode
  defaultRange: ChartRange
}

export function TvsChartControlsContextProvider({
  children,
  defaultRange,
}: Props) {
  const [unit, setUnit] = useState<ChartUnit>('usd')
  const [range, setRange] = useState<ChartRange>(defaultRange)
  return (
    <TvsChartControlsContext.Provider
      value={{
        unit,
        setUnit,
        range,
        setRange,
      }}
    >
      {children}
    </TvsChartControlsContext.Provider>
  )
}

export function useTvsChartControlsContext() {
  const context = useContext(TvsChartControlsContext)
  if (!context) {
    throw new Error(
      'TvsChartControlsContext must be used within a TvsChartControlsContextProvider',
    )
  }
  return context
}
