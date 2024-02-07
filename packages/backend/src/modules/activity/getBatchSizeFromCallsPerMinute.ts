import { assert } from '@l2beat/shared-pure'

export function getBatchSizeFromCallsPerMinute(
  callsPerMinute: number,
  batchDurationSeconds = 60,
): number {
  assert(
    callsPerMinute >= batchDurationSeconds,
    `callsPerMinute=${callsPerMinute} must be greater or equal to batchDurationSeconds=${batchDurationSeconds}`,
  )
  return Math.floor(callsPerMinute / batchDurationSeconds)
}
