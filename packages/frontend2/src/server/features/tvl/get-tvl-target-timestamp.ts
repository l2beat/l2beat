import { UnixTime } from '@l2beat/shared-pure'

export function getTvlTargetTimestamp() {
  // Note that UnixTime.toEndOf('hour') returns the end of the current hour, so we need to subtract 2 hours.
  return UnixTime.now().toEndOf('hour').add(-2, 'hours')
}
