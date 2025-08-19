import { createContext, useContext, useState } from 'react'
import type { ChartUnit } from '~/components/chart/types'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'

type ScalingTvsChartControlsContextValue = {
  unit: ChartUnit
  setUnit: React.Dispatch<React.SetStateAction<ChartUnit>>
  range: TvsChartRange
  setRange: React.Dispatch<React.SetStateAction<TvsChartRange>>
}

const ScalingTvsChartControlsContext =
  createContext<ScalingTvsChartControlsContextValue | null>(null)

interface Props {
  children: React.ReactNode
  defaultRange: TvsChartRange
}

export function ScalingTvsChartControlsContextProvider({
  children,
  defaultRange,
}: Props) {
  const [unit, setUnit] = useState<ChartUnit>('usd')
  const [range, setRange] = useState<TvsChartRange>(defaultRange)
  return (
    <ScalingTvsChartControlsContext.Provider
      value={{
        unit,
        setUnit,
        range,
        setRange,
      }}
    >
      {children}
    </ScalingTvsChartControlsContext.Provider>
  )
}

export function useScalingTvsChartControlsContext() {
  const context = useContext(ScalingTvsChartControlsContext)
  if (!context) {
    throw new Error(
      'ScalingTvsChartControlsContext must be used within a ScalingTvsChartControlsContextProvider',
    )
  }
  return context
}
