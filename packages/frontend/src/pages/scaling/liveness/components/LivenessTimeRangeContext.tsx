import { createContext, useContext, useState } from 'react'
import type { LivenessTimeRange } from '~/server/features/scaling/liveness/types'

type LivenessTimeRangeContextValue = {
  timeRange: LivenessTimeRange
  setTimeRange: React.Dispatch<React.SetStateAction<LivenessTimeRange>>
}

const LivenessTimeRangeContext =
  createContext<LivenessTimeRangeContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function LivenessTimeRangeContextProvider({ children }: Props) {
  const [timeRange, setTimeRange] = useState<LivenessTimeRange>('30d')
  return (
    <LivenessTimeRangeContext.Provider
      value={{
        timeRange,
        setTimeRange,
      }}
    >
      {children}
    </LivenessTimeRangeContext.Provider>
  )
}

export function useLivenessTimeRangeContext() {
  const context = useContext(LivenessTimeRangeContext)
  if (!context) {
    throw new Error(
      'LivenessTimeRangeContext must be used within a LivenessTimeRangeContextProvider',
    )
  }
  return context
}
