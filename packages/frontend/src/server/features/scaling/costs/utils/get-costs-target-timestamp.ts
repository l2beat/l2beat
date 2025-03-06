import { UnixTime } from '@l2beat/shared-pure'

export function getCostsTargetTimestamp() {
  return UnixTime.toStartOf(UnixTime.now(), 'hour') - 1 * UnixTime.HOUR
}
