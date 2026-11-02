import { createContext, useContext } from 'react'
import { useQueryState } from '~/hooks/useQueryState'
import { chartRangeCodec } from '~/utils/queryParamCodecs'
import type { ChartRange } from '~/utils/range/range'

const RANGE_CODEC = chartRangeCodec('1y')

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
  const [range, setRange] = useQueryState('range', RANGE_CODEC)
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
