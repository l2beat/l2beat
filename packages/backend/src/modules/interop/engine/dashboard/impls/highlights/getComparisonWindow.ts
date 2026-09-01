import { UnixTime } from '@l2beat/shared-pure'

export function getComparisonWindow(
  windowEnd: UnixTime,
  previousWindowEnd = windowEnd - UnixTime.DAY,
) {
  return {
    windowStart: windowEnd - UnixTime.DAY,
    windowEnd,
    previousWindowStart: previousWindowEnd - UnixTime.DAY,
    previousWindowEnd,
  }
}
export function getActivityComparisonWindow(windowStart: UnixTime) {
  return {
    windowStart,
    windowEnd: windowStart + UnixTime.DAY,
    previousWindowStart: windowStart - UnixTime.DAY,
    previousWindowEnd: windowStart,
  }
}
