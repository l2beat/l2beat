import { createContext, useContext } from 'react'
import { useQueryState } from '~/hooks/useQueryState'
import { chartRangeCodec } from '~/utils/queryParamCodecs'
import type { ChartRange } from '~/utils/range/range'

const RANGE_CODEC = chartRangeCodec('30d')

type CostsTimeRangeContextValue = {
  range: ChartRange
  setRange: (range: ChartRange) => void
}

const CostsTimeRangeContext = createContext<CostsTimeRangeContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
}

export function CostsTimeRangeContextProvider({ children }: Props) {
  const [range, setRange] = useQueryState('range', RANGE_CODEC)
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
