import { useEffect, useState } from 'react'
import type { ApiCriticalFlag } from '../../../api/types'
import {
  getNextCriticalTransitionDelayMs,
  MAX_CRITICAL_TIMEOUT_MS,
} from '../ossification'

const BOUNDARY_BUFFER_MS = 50

// Re-renders at the next `sinceTimestamp` / `untilTimestamp` boundary so
// time-bounded ossification statuses stay accurate while a tab remains open.
export function useCriticalNow(
  flags: readonly (ApiCriticalFlag | undefined)[],
): number {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const delayMs = getNextCriticalTransitionDelayMs(flags, Date.now())
    if (delayMs === undefined) {
      return
    }
    const timer = setTimeout(
      () => {
        setTick((n) => n + 1)
      },
      Math.min(delayMs + BOUNDARY_BUFFER_MS, MAX_CRITICAL_TIMEOUT_MS),
    )
    return () => clearTimeout(timer)
  }, [flags, tick])

  return Math.floor(Date.now() / 1000)
}
