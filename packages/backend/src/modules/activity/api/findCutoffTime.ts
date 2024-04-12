import { UnixTime } from '@l2beat/shared-pure'

const CUTOFF_TRESHOLD = 0.8

/**
 * Calculates the cutoff time for the estimation of the daily transaction count.
 * @param projects typically an DailyTransactionCount[][]; an array of arrays of objects with a timestamp property, based on which the cutoff time is calculated
 * @returns The cutoff time, which is the timestamp of the last element of the array at the 80% position.
 */
export function findCutoffTime(
  projects: { timestamp: UnixTime }[][],
): UnixTime {
  const lasts = projects
    .map((counts) => counts.at(-1)?.timestamp.toNumber())
    .filter((t): t is number => t !== undefined)
    .sort((a, b) => b - a)
  return lasts.length > 0
    ? new UnixTime(lasts[Math.floor(CUTOFF_TRESHOLD * lasts.length)])
    : UnixTime.now()
}
