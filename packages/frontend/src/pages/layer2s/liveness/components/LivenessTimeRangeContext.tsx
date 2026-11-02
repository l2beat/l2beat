import { createContext, useContext } from 'react'
import { useQueryState } from '~/hooks/useQueryState'
import type { LivenessTimeRange } from '~/server/features/layer2s/liveness/types'
import { oneOfCodec } from '~/utils/queryParamCodecs'

const TIME_RANGE_CODEC = oneOfCodec<LivenessTimeRange>(
  ['30d', '90d', 'max'],
  '30d',
)

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
  const [timeRange, setTimeRange] = useQueryState('range', TIME_RANGE_CODEC)
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
