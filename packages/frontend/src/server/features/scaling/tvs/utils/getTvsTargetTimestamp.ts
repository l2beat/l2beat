import { UnixTime } from '@l2beat/shared-pure'

export function getTvsTargetTimestamp() {
  return (
    UnixTime.toStartOf(UnixTime.now(), 'hour') -
    UnixTime.HOUR -
    15 * UnixTime.MINUTE
  )
}
