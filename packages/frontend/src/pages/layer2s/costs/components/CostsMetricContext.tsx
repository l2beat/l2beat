import { createContext, useContext } from 'react'
import { useQueryState } from '~/hooks/useQueryState'
import { oneOfCodec } from '~/utils/queryParamCodecs'

export type CostsMetric = 'total' | 'per-l2-uop'

const METRIC_CODEC = oneOfCodec<CostsMetric>(
  ['total', 'per-l2-uop'],
  'per-l2-uop',
)

type CostsMetricContextValue = {
  metric: CostsMetric
  setMetric: React.Dispatch<React.SetStateAction<CostsMetric>>
}

const CostsMetricContext = createContext<CostsMetricContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function CostsMetricContextProvider({ children }: Props) {
  const [metric, setMetric] = useQueryState('metric', METRIC_CODEC)
  return (
    <CostsMetricContext.Provider
      value={{
        metric,
        setMetric,
      }}
    >
      {children}
    </CostsMetricContext.Provider>
  )
}

export function useCostsMetricContext() {
  const context = useContext(CostsMetricContext)
  if (!context) {
    throw new Error(
      'CostsMetricContext must be used within a CostsMetricContextProvider',
    )
  }
  return context
}
