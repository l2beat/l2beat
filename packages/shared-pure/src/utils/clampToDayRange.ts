import { UnixTime } from '../types/UnixTime.js'

export function clampRangeToDay(
  from: UnixTime,
  to: UnixTime,
): { from: UnixTime; to: UnixTime } {
  if (UnixTime.toStartOf(from, 'day') !== UnixTime.toStartOf(to, 'day')) {
    return { from, to: UnixTime.toNext(from, 'day') }
  }
  return { from, to }
}
