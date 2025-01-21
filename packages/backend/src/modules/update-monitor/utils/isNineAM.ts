import type { UnixTime } from '@l2beat/shared-pure'

export function isNineAM(timestamp: UnixTime, timezone: 'CET' | 'UTC') {
  const offset = timezone === 'CET' ? 3 : 0
  const hour = 9 - offset

  return timestamp
    .toStartOf('hour')
    .equals(timestamp.toStartOf('day').add(hour, 'hours'))
}
