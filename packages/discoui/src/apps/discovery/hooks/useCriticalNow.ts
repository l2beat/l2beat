import { useEffect, useRef, useState } from 'react'
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
  const renderedNowMs = Date.now()
  const renderedNowMsRef = useRef(renderedNowMs)
  renderedNowMsRef.current = renderedNowMs

  useEffect(() => {
    const currentMs = Date.now()
    const delayFromRender = getNextCriticalTransitionDelayMs(
      flags,
      renderedNowMsRef.current,
    )
    if (
      delayFromRender !== undefined &&
      renderedNowMsRef.current + delayFromRender <= currentMs
    ) {
      setTick((n) => n + 1)
      return
    }
    const delayMs = getNextCriticalTransitionDelayMs(flags, currentMs)
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

  return Math.floor(renderedNowMs / 1000)
}
