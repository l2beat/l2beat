import type { DaLayerThroughput } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useEffect, useState } from 'react'
import { type BlockLimits, getBlockLimits, nextLimitsIn } from './model'

/** Longest a timer runs; told to wait longer, it would fire at once */
const MAX_TIMEOUT_MS = 2 ** 31 - 1

/**
 * The limits in force now, moving on with the chain: a page left open across
 * a fork takes up its limits the moment it activates, rather than on reload
 */
export function useBlockLimits(throughputs: DaLayerThroughput[]): BlockLimits {
  const [limits, setLimits] = useState(() => getBlockLimits(throughputs))
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const awaitNext = () => {
      const seconds = nextLimitsIn(throughputs, UnixTime.now())
      if (seconds === undefined) return
      timer = setTimeout(
        () => {
          setLimits(getBlockLimits(throughputs))
          awaitNext()
        },
        Math.min(seconds * 1000, MAX_TIMEOUT_MS),
      )
    }
    awaitNext()
    return () => clearTimeout(timer)
  }, [throughputs])
  return limits
}
