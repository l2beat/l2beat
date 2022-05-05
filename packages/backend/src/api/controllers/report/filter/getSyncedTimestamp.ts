import { UnixTime } from '@l2beat/common'

export function getSyncedTimestamp(
  timestamps: UnixTime[],
  granularity: 'days' | 'hours'
): UnixTime {
  const maxTimestamp = timestamps.reduce(
    (max, current) => (current.gt(max) ? current : max),
    new UnixTime(0)
  )

  const allSynced = timestamps.every((timestamp) =>
    timestamp.equals(maxTimestamp)
  )

  if (!allSynced) {
    const earlier = maxTimestamp.add(-1, granularity)
    if (timestamps.some((timestamp) => timestamp.equals(earlier))) {
      return earlier
    }
  }

  return maxTimestamp
}
