import { UnixTime } from '@l2beat/common'

interface Range {
  from: UnixTime
  to: UnixTime
}

export function getQueryRanges(
  from: UnixTime,
  to: UnixTime,
  dbStatus: { earliest: UnixTime; latest: UnixTime } | undefined,
  sinceTimestamp: UnixTime,
): Range[] {
  const ranges: { from: UnixTime; to: UnixTime }[] = []

  const fromAdjusted = sinceTimestamp.gt(from) ? sinceTimestamp : from

  if (dbStatus === undefined) {
    return [{ from: fromAdjusted, to }]
  }

  const { earliest, latest } = dbStatus

  if (earliest.gt(fromAdjusted)) {
    ranges.push({ from: fromAdjusted, to: earliest })
  }

  if (latest.lt(to)) {
    ranges.push({ from: latest, to })
  }

  return ranges
}
