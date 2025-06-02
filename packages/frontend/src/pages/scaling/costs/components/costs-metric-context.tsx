import { createContext, useContext, useState } from 'react'

export type CostsMetric = 'total' | 'per-l2-uop'

type CostsMetricContextValue = {
  metric: CostsMetric
  setMetric: React.Dispatch<React.SetStateAction<CostsMetric>>
}

const CostsMetricContext = createContext<CostsMetricContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function CostsMetricContextProvider({ children }: Props) {
  const [metric, setMetric] = useState<CostsMetric>('per-l2-uop')
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
