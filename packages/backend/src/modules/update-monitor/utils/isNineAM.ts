import { UnixTime } from '@l2beat/shared-pure'

export function isNineAM(timestamp: UnixTime, timezone: 'CET' | 'UTC') {
  const offset = timezone === 'CET' ? 3 : 0
  const hour = 9 - offset

  return (
    UnixTime.toStartOf(timestamp, 'hour') ===
    UnixTime.toStartOf(timestamp, 'day') + UnixTime(hour, 'hours')
  )
}
