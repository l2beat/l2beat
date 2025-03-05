import { UnixTime } from '@l2beat/shared-pure'

export function getCostsTargetTimestamp() {
  return UnixTime.toStartOf(UnixTime.now(), 'hour') - UnixTime(1, 'hours')
}
