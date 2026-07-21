import { createContext, useContext, useState } from 'react'

export type ActivityMetric = 'tps' | 'uops'

type ActivityMetricContextValue = {
  metric: ActivityMetric
  setMetric: React.Dispatch<React.SetStateAction<ActivityMetric>>
}

const ActivityMetricContext = createContext<ActivityMetricContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
}

export function ActivityMetricContextProvider({ children }: Props) {
  const [metric, setMetric] = useState<ActivityMetric>('uops')
  return (
    <ActivityMetricContext.Provider
      value={{
        metric,
        setMetric,
      }}
    >
      {children}
    </ActivityMetricContext.Provider>
  )
}

export function useActivityMetricContext() {
  const context = useContext(ActivityMetricContext)
  if (!context) {
    throw new Error(
      'ActivityMetricContext must be used within a ActivityMetricContextProvider',
    )
  }
  return context
}
