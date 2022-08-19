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
  if (from.equals(to)) {
    throw new Error('Programmer error')
  }

  const ranges: { from: UnixTime; to: UnixTime }[] = []

  const fromAdjusted = sinceTimestamp.gt(from) ? sinceTimestamp : from

  if (dbStatus === undefined) {
    return [{ from: fromAdjusted, to }]
  }

  const { earliest, latest } = dbStatus

  if (earliest.gt(fromAdjusted)) {
    ranges.push({ from: fromAdjusted, to: earliest.add(-1, 'hours') })
  }

  if (latest.lt(to)) {
    ranges.push({ from: latest.add(1, 'hours'), to })
  }

  return ranges
}
